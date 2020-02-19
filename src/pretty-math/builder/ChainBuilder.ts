import {
    DerivativeNode,
    INode,
    IntegralNode,
    IOperatorNode,
    isMissingNode,
    isRootNodeType,
    ISymbolNode,
    MatrixNode,
    ParensNode,
    parseCalchub,
    parsePython
} from 'math';
import {
    BlankBlock,
    Block,
    BlockBuilder,
    BlockUtils,
    BuilderFn,
    DefineFunctionBlock,
    DerivativeBlock,
    DifferentialBlock,
    FractionBlock,
    FunctionBlock,
    IBlock,
    IntegralBlock,
    latexToEntryMap,
    MatrixBlock,
    PartialDifferentialBlock,
    RadicalBlock,
    TOKEN_TO_BUILDER,
} from 'pretty-math/internal';

const { buildSupSub, chainFromString, reduceChains } = BlockBuilder;

export function buildChainFromMath(math: string, definedFnNames?: string[]): IBlock {
    // try calchub?
    let block = buildChainFromCalchub(math, definedFnNames);

    if (!block) {
        // try python
        block = buildChainFromPython(math, definedFnNames);
    }

    return block;
}

export function buildChainFromCalchub(calchub: string, definedFnNames?: string[]): IBlock {
    const { root } = parseCalchub(calchub, definedFnNames);
    return buildChainFromTree(root && root.only);
}

export function buildChainFromPython(python: string, definedFnNames?: string[]): IBlock {
    const { root } = parsePython(python, definedFnNames);
    return buildChainFromTree(root && root.only);
}

export function buildChainFromTree(tree: INode): IBlock {
    if (tree == null) {
        return null;
    }

    // build in post-order
    // so build children first
    const childBlocks = tree.children.map(childNode => buildChainFromTree(childNode));

    if (isRootNodeType(tree)) {
        return reduceChains(childBlocks);
    }

    const builder = TOKEN_TO_BUILDER[tree.tokenName];

    if (!builder) {
        return reduceChains(childBlocks);
    }

    const chain = builder(tree, childBlocks);

    return BlockUtils.mergeAdjacentSupSubs(chain);
}

export function biop(op: string): BuilderFn {
    return (node: IOperatorNode, children: IBlock[]) => {
        const left = children[0];
        const right = children[1];
        return reduceChains([left, chainFromString(op), right]);
    }
}

export function block(display: string, command?: string): BuilderFn {
    return (node: INode) => {
        return new Block(display, command);
    }
}

export function derivative(node: DerivativeNode): IBlock {
    const args = node.argNodes.map(arg => buildChainFromTree(arg));
    const der = new DerivativeBlock();
    der.setInner(args[0]);
    der.setWrt(args[1]);
    return der;
}

export function dfunc(node: IOperatorNode): IBlock {
    const args = node.argNodes.map(arg => buildChainFromTree(arg));
    const dfunc = new DefineFunctionBlock();
    dfunc.setFuncName(args[0]);
    dfunc.setInner(args[1]);
    return dfunc;
}

export function diff(node: IOperatorNode, children: IBlock[]): IBlock {
    const diff = new DifferentialBlock();
    diff.setInner(children[0]);
    return diff;
}

export function frac(node: IOperatorNode): IBlock {
    const args = node.argNodes.map(arg => buildChainFromTree(arg));
    const frac = new FractionBlock();
    frac.setNum(args[0]);
    frac.setDenom(args[1]);
    return frac;
}

export function integral(node: IntegralNode): IBlock {
    const integral = new IntegralBlock();
    integral.setInner(isMissingNode(node.expression) ? new BlankBlock() : buildChainFromTree(node.expression));
    integral.setWrt(isMissingNode(node.wrt) ? new BlankBlock() : buildChainFromTree(node.wrt));
    integral.setLeftBound(isMissingNode(node.leftBound) ? new BlankBlock() : buildChainFromTree(node.leftBound));
    integral.setRightBound(isMissingNode(node.rightBound) ? new BlankBlock() : buildChainFromTree(node.rightBound));
    return integral;
}

export function tokenValue(node: INode): IBlock {
    return chainFromString(node.tokenValue);
}

export function func(display: string, command?: string): BuilderFn {
    return (node: IOperatorNode, children: IBlock[]) => {
        const func = new FunctionBlock(display, command || display);
        func.setInner(children[0]);
        return func;
    }
}

export function libraryEntry(command: string): BuilderFn {
    return (node: INode) => {
        const entry = latexToEntryMap[command];
        if (!entry) {
            return tokenValue(node);
        }
        return new Block(entry.text, entry.latex);
    }
}

export function matrix(node: MatrixNode): IBlock {
    const m = new MatrixBlock();
    node.rows.forEach(arrayNode => {
        const items = arrayNode.children.map(c => {
            return buildChainFromTree(c) || new BlankBlock();
        });
        m.pushRow(items);
    });
    return m;
}

export function parens(node: ParensNode, children: IBlock[]): IBlock {
    return reduceChains([chainFromString(node.parens), ...children, chainFromString(node.parensPair)])
}

export function partialDiff(node: INode, children: IBlock[]): IBlock {
    const pdiff = new PartialDifferentialBlock();
    pdiff.setInner(children[0]);
    return pdiff;
}

export function sqrt(node: INode, children: IBlock[]): IBlock {
    const radical = new RadicalBlock();
    radical.setInner(children[0]);
    return radical;
}

export function sup(node: INode, children: IBlock[]): IBlock {
    return reduceChains([children[0], buildSupSub(children[1])]);
}

export function symbol(node: ISymbolNode): IBlock {
    // need to split the symbol on '_' underscores
    const parts = node.tokenValue.split('_');

    if (parts.length === 0) {
        return null;
    }

    // first part is the main part
    const mainPart = chainFromString(parts.shift());

    // subsequent parts are subscripts
    let sub = null;
    while (parts.length > 0) {
        sub = buildSupSub(null, chainFromString(parts.pop()));
    }

    return reduceChains([mainPart, sub]);
}

export function udf(node: IOperatorNode, children: IBlock[]): IBlock {
    const fnName = node.tokenValue;
    return func(fnName)(node, children);
}

export function unary(node: IOperatorNode, children: IBlock[]): IBlock {
    const chains = children;

    if (node.isRightAssoc) {
        chains.unshift(chainFromString(node.tokenValue));
    } else {
        // left assoc, so put it after it's children
        chains.push(chainFromString(node.tokenValue));
    }

    return reduceChains(chains);
}
