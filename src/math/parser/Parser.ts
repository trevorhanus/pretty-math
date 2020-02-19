import {
    ArrayNode,
    buildImplMultiplyNode,
    buildNode,
    buildSourceMapFromTree,
    INode,
    IOperatorNode,
    isBinaryOpFam,
    isConstantFam,
    isFuncFam,
    isLeftAssocUnaryOp,
    isLeftParensFam,
    isLiteralFam,
    isMinusSign,
    isOperandType,
    isRightAssocUnaryOp,
    isRightParensFam,
    isSymbolFam,
    markLocalSymbols,
    MathSyntaxError,
    MathWarning,
    NodeFamily,
    NodeType,
    OperatorNode,
    ParensNode,
    ParseResult,
    replaceImplicitMultiNodesWithUserDefinedFunctionsWhereApplicable,
    replaceImplicitMultiplicationNodesWithAccessorNodesWhereApplicable,
    RootNode,
    Token,
    tokenizeCalchub,
    tokenizePython,
    TokenizeResult,
    TokenName,
} from '../internal';
import { replaceToken } from './tokenizers/TokenUtils';

export class Parser {
    private warnings: MathWarning[];
    private nodes: INode[];
    private outputStack: INode[];
    private opStack: IOperatorNode[];
    private pointer: number;
    private tokens: Token[];

    private get opStackIsEmpty(): boolean {
        return this.opStack.length === 0;
    }

    private init() {
        this.warnings = [];
        this.nodes = [];
        this.opStack = [];
        this.outputStack = [];
        this.pointer = -1;
        this.tokens = [];
    }

    parse(tokenizeResult: TokenizeResult, definedFnNames?: string[]): ParseResult {
        if (tokenizeResult.error) {
            return {
                ...tokenizeResult,
                root: null,
                sourceMap: {},
            }
        }

        try {
            this.init();

            let nodes: INode[] = [];
            let tokens = tokenizeResult.tokens;

            // create nodes from each token
            tokens.forEach(token => {
                if (token.name === TokenName.Space) {
                    return;
                }

                const node = buildNode(token);

                if (node) {
                    nodes.push(buildNode(token))
                }
            });

            // do some pre-processing of the nodes
            swapMinusSignForUnaryOrBinary(tokens, nodes);
            insertMissingOperands(nodes);

            this.tokens = tokens;
            this.nodes = nodes;

            let node = this.nextNode();
            while (node != null) {
                this.processNode(node);
                node = this.nextNode();
            }

            // now we need to empty the opStack
            while (this.opStack.length > 0) {
                const peek = this.peekAtTopOp();

                if (isLeftParensFam(peek) || isRightParensFam(peek)) {
                    const op = this.opStack.pop() as IOperatorNode;
                    throw new MathSyntaxError('Unbalanced parentheses.', op.tokenStart, op.tokenEnd);
                } else {
                    this.placeNextOpOnOutputStack();
                }
            }

            if (this.outputStack.length > 1) {
                console.log('output stack: ', this.outputStack);
                throw new MathSyntaxError('Invalid syntax.');
            }

            let root = new RootNode();
            this.outputStack.forEach(node => {
                root.addChild(node);
            });

            markLocalSymbols(root);
            root = replaceImplicitMultiNodesWithUserDefinedFunctionsWhereApplicable(root, makeMap(definedFnNames)) as RootNode;
            root = replaceImplicitMultiplicationNodesWithAccessorNodesWhereApplicable(root) as RootNode;

            return {
                error: null,
                input: tokenizeResult.input,
                root,
                sourceMap: buildSourceMapFromTree(root),
                tokens: this.tokens,
                warnings: [].concat(tokenizeResult.warnings, this.warnings),
            };
        } catch (e) {
            if (e instanceof MathSyntaxError) {
                return {
                    error: e,
                    input: tokenizeResult.input,
                    root: null,
                    sourceMap: {},
                    tokens: this.tokens,
                    warnings: [].concat(tokenizeResult.warnings, this.warnings),
                };
            } else {
                throw e;
            }
        }

    }

    private processNode(node: INode) {
        this.insertImplicitMultiplicationIfRequired(node);

        switch (node.type) {

            case NodeType.Operator:
                return this.placeOpOnStack(node as OperatorNode);

            case NodeType.Operand:
                return this.outputStack.push(node);

            case NodeType.Parens:
                return this.handleParens(node as ParensNode);

            default:
                throw new Error(`Not setup to handle NodeType: ${node.type}`);

        }
    }

    private placeOpOnStack(op: IOperatorNode) {

        // if stack is empty, just push the op on
        if (this.opStackIsEmpty) {
            this.opStack.push(op);
            return;
        }

        // peek at the top token on the stack
        let topOp = this.peekAtTopOp();

        if (isLeftParensFam(topOp)) {
            this.opStack.push(op);
            return;
        }

        while (
            topOp != null
            && (
                topOp.prec > op.prec
                || (topOp.prec === op.prec && op.isLeftAssoc)
            )
        ) {
            this.placeNextOpOnOutputStack();
            topOp = this.peekAtTopOp();
        }

        this.opStack.push(op);
    }

    private placeNextOpOnOutputStack() {
        const args: INode[] = [];
        const op = this.opStack.pop() as IOperatorNode;

        let numArgsToPop = Math.max(0, op.nArgs);

        while (numArgsToPop > 0) {
            const arg = this.outputStack.pop();
            args.unshift(arg);
            numArgsToPop--;
        }

        op.setChildren(args);

        this.outputStack.push(op);
    }

    private handleMinus(op: IOperatorNode): IOperatorNode {
        const prev = this.peekAtNextNode(-1);

        let token: Token = null;

        if (prev && (isOperandType(prev) || isRightParensFam(prev))) {
            // should be a binary op
            token = Token.binaryMinus(op.token);
        } else {
            // should be a unary minus
            token = Token.unaryMinus(op.token);
        }

        // replace the token
        // and the node
        replaceToken(this.tokens, op.token, token);
        const newOp = buildNode(token) as IOperatorNode;
        this.nodes.splice(this.pointer, 1, newOp);

        return newOp;
    }

    private handleParens(node: ParensNode) {
        if (isLeftParensFam(node)) {
            this.opStack.push(node);
        }

        if (isRightParensFam(node)) {
            this.handleRightParens(node);
        }
    }

    private handleRightParens(node: ParensNode) {
        // need to pop operators off the opStack until we find
        // the first left parens
        if (this.opStackIsEmpty) {
            throw new MathSyntaxError('Unbalanced parentheses.', node.tokenStart, node.tokenEnd);
        }

        let nextOp = this.peekAtTopOp();

        while (nextOp != null && !isLeftParensFam(nextOp)) {
            if (this.opStackIsEmpty || isRightParensFam(nextOp)) {
                throw new MathSyntaxError('Unbalanced parentheses.', nextOp.tokenStart, nextOp.tokenEnd);
            }

            this.placeNextOpOnOutputStack();
            nextOp = this.peekAtTopOp();
        }

        // is it a parens pair?
        if (!node.isParensPair(nextOp)) {
            throw new MathSyntaxError('Non-matching parentheses.', nextOp.tokenStart, nextOp.tokenEnd);
        }

        // is it an array closer?
        if (node.isArrayCloser) {
            // pop off the last output
            const opener = nextOp as ParensNode;
            const closer = node;
            const arg = this.outputStack.pop();
            const array = ArrayNode.fromArg(arg);
            this.outputStack.push(array);
        }

        this.opStack.pop();
    }

    private insertImplicitMultiplicationIfRequired(node: INode) {
        const prev = this.peekAtNextNode(-1);

        if (!prev) {
            return;
        }

        switch (node.family) {

            case NodeFamily.Constant:
            case NodeFamily.Func:
            case NodeFamily.LeftParens:
            case NodeFamily.TableRange:
            case NodeFamily.Symbol:
                if (isLiteralFam(prev) || isSymbolFam(prev) || isRightParensFam(prev) || isConstantFam(prev)) {
                    this.placeOpOnStack(buildImplMultiplyNode());
                }
                break;

            case NodeFamily.Literal:
                if (isRightParensFam(prev)) {
                    this.placeOpOnStack(buildImplMultiplyNode());
                }
                break;

        }
    }

    private addWarning(message: string, start?: number, end?: number) {
        this.warnings.push({
            message,
            start,
            end,
        });
    }

    private nextNode(): INode {
        this.pointer = this.pointer + 1;
        return this.pointer < this.nodes.length
            ? this.nodes[this.pointer]
            : null;
    }

    private peekAtNextNode(i = 1): INode {
        const nextIndex = this.pointer + i;
        return nextIndex < this.nodes.length
            ? this.nodes.slice(nextIndex, nextIndex + 1)[0]
            : null;
    }

    private peekAtTopOp(): IOperatorNode {
        return this.opStack.slice(-1)[0];
    }
}

function insertMissingOperands(nodes: INode[]) {
    let i = 0;

    const insertMissing = (atIndex: number) => {
        const token = new Token(TokenName.Missing, '', -1);
        const node = buildNode(token);
        nodes.splice(atIndex, 0, node);
    };

    while (i < nodes.length) {
        const prev = peek(nodes, i - 1);
        const node = nodes[i];
        const next = peek(nodes, i + 1);

        if (isLeftAssocUnaryOp(node)) {
            if (!prev || isLeftParensFam(prev) || isRightAssocUnaryOp(prev) || isBinaryOpFam(prev) || isFuncFam(prev)) {
                insertMissing(i);
                i++;
            }
        }

        if (isRightAssocUnaryOp(node)) {
            if (!next || isRightParensFam(next) || isLeftAssocUnaryOp(next) || isBinaryOpFam(next)) {
                insertMissing(i + 1);
                i++;
            }
        }

        if (isBinaryOpFam(node)) {
            if (!prev || isLeftParensFam(prev) || isRightAssocUnaryOp(prev) || isBinaryOpFam(prev) || isFuncFam(prev)) {
                insertMissing(i);
                i++;
            }

            if (!next || isRightParensFam(next) || isLeftAssocUnaryOp(next) || isBinaryOpFam(next)) {
                insertMissing(i + 1);
                i++;
            }
        }

        if (isFuncFam(node)) {
            if (!next || isRightParensFam(next) || isLeftAssocUnaryOp(next) || isBinaryOpFam(next)) {
                insertMissing(i + 1);
                i++;
            }
        }

        if (isLeftParensFam(node)) {
            if (next && node.isParensPair(next)) {
                insertMissing(i + 1);
                i++;
            }
        }

        i++;
    }
}

function peek(nodes: INode[], index: number): INode {
    return index > -1 && index < nodes.length
        ? nodes.slice(index, index + 1)[0]
        : null;
}

export function swapMinusSignForUnaryOrBinary(tokens: Token[], nodes: INode[]) {
    let i = 0;

    while (i < nodes.length) {
        const node = nodes[i];
        const prev = peek(nodes, i - 1);

        if (!isMinusSign(node)) {
            i++;
            continue;
        }

        let token: Token = null;

        if (prev && (isOperandType(prev) || isRightParensFam(prev))) {
            // should be a binary op
            token = Token.binaryMinus(node.token);
        } else {
            // should be a unary minus
            token = Token.unaryMinus(node.token);
        }

        // replace the token
        // and the node
        replaceToken(tokens, node.token, token);
        nodes.splice(i, 1, buildNode(token));

        i++;
    }
}

function makeMap(fnNames: string[]): { [fnName: string]: true } {
    return (fnNames || []).reduce((map, fnName) => {
        map[fnName] = true;
        return map;
    }, {});
}

export function parsePython(python: string, definedFnNames?: string[]): ParseResult {
    const parser = new Parser();
    const parseResult = parser.parse(tokenizePython(python), definedFnNames);

    // replace divide binary op with frac function


    return parseResult;
}

export function parseCalchub(expr: string, definedFnNames?: string[]): ParseResult {
    const parser = new Parser();
    return parser.parse(tokenizeCalchub(expr), definedFnNames);
}
