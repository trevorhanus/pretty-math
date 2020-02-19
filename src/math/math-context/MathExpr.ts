import { action, computed, observable } from 'mobx';
import { v4 as uuidv4 } from 'uuid';
import {
    Color,
    ErrorCode,
    ExprResolver,
    FuncDefinitionNode,
    getRandomHexColor,
    getUniqueAnySymbolNodes,
    getUniqueNonLocalSymbolNodes,
    getUniqueUdfInvocationNodes,
    IColor,
    INode,
    IOperatorNode,
    isAssignment,
    isFuncDefinitionTree,
    isVarDefinitionTree,
    ISymbolNode,
    MathContext,
    MathError,
    MathExprProps,
    omitNulls,
    OperatorNode,
    parseCalchub,
    ParseResult,
    SymbolNode,
    Token
} from '../internal';

export class MathExpr {
    private _id: string;
    private _color: IColor;
    @observable private _description: string;
    @observable private _expr: string;
    @observable private _fnName: string;
    @observable.ref private _mathCxt: MathContext;
    readonly resolver: ExprResolver;
    @observable private _symbol: string;
    @observable private _units: string;
    @observable private _parseError: any;

    constructor(id?: string) {
        this._id = id != null ? id : uuidv4();
        this._color = Color.fromStr(getRandomHexColor());
        this.resolver = new ExprResolver(this);
        this.resolver.init();
    }

    get id(): string {
        return this._id;
    }

    @computed
    get color(): IColor {
        return this._color;
    }

    @computed
    get description(): string {
        return this._description;
    }

    @computed
    get error(): MathError | Error {
        const { error } = this.parseResult;

        if (error) {
            return error;
        }

        // Duplicate Varable?
        if (this.mathCxt && this.isVariable) {
            const vars = this.mathCxt.getVarsBySymbol(this.symbol);
            const funcs = this.mathCxt.getFuncsByFnName(this.symbol);

            if (vars.length > 1) {
                return {
                    code: ErrorCode.Duplicate,
                    message: `Variable '${this.symbol}' already exists.`,
                };
            }

            if (funcs.length > 0) {
                return {
                    code: ErrorCode.Duplicate,
                    message: `'${this.symbol}' is defined as a function.`,
                };
            }
        }

        // Duplicate Function?
        if (this.mathCxt && this.isFunctionDefinition) {
            const vars = this.mathCxt.getVarsBySymbol(this.funcName);
            const funcs = this.mathCxt.getFuncsByFnName(this.funcName);

            if (vars.length > 0) {
                return {
                    code: ErrorCode.Duplicate,
                    message: `'${this.funcName}' is defined as a variable.`,
                };
            }

            if (funcs.length > 1) {
                return {
                    code: ErrorCode.Duplicate,
                    message: `Function '${this.symbol}' already exists.`,
                };
            }
        }

        return this.resolver.error;
    }

    @computed
    get expr(): string {
        return this._expr;
    }

    @computed
    get errorMessage(): string {
        return this.error ? this.error.message : '';
    }

    @computed
    get formulaRoot(): INode {
        if (this.isVariable || this.isFunctionDefinition) {
            return (this.shallowTree as OperatorNode).right
        }

        return null;
    }

    @computed
    get funcName(): string {
        return this._fnName;
    }

    @computed
    get fnParamNodes(): INode[] {
        const tree = this.shallowTree;

        return (
            isFuncDefinitionTree(tree)
            && (tree.left as IOperatorNode).argNodes.slice(1)
        ) || [];
    }

    @computed
    get funcDefinitionLocalSymbolNames(): string[] {
        const tree = this.shallowTree;
        return (
            isFuncDefinitionTree(tree)
            && (tree.left as FuncDefinitionNode).getLocalSymbolNames()
        ) || [];
    }

    @computed
    get hasError(): boolean {
        return !!this.error;
    }

    @computed
    get immediateRefs(): MathExpr[] {
        if (this._mathCxt == null) return [];

        const exprs = [];

        this.uniqueNonLocalSymbolNodes.forEach(node => {
            const expr = this._mathCxt.getVar(node.symbol);
            if (expr) {
                exprs.push(expr);
            }
        });

        // also need user defined function invocations
        this.uniqueUdfNodes.forEach(node => {
            const expr = this._mathCxt.getFunc(node.tokenValue);
            if (expr) {
                exprs.push(expr);
            }
        });

        return exprs;
    }

    @computed
    get isEmpty(): boolean {
        return this._expr == null || this._expr === '';
    }

    @computed
    get isFunctionDefinition(): boolean {
        return this.funcName != null;
    }

    @computed
    get isPlottable(): boolean {
        if (this.resolver.isResolving || !this.resolver.deepFormulaTree) {
            return false;
        }

        const uniqueSymbols = getUniqueAnySymbolNodes(this.resolver.deepFormulaTree);
        return uniqueSymbols.length <= 1;
    }

    @computed
    get isVariable(): boolean {
        return this.symbol != null;
    }

    @computed
    get mathCxt(): MathContext {
        return this._mathCxt;
    }

    @computed
    get uniqueNonLocalSymbolNodes(): ISymbolNode[] {
        return getUniqueNonLocalSymbolNodes(formulaRoot(this.shallowTree));
    }

    @computed
    get uniqueUdfNodes(): INode[] {
        return getUniqueUdfInvocationNodes(formulaRoot(this.shallowTree));
    }

    @computed
    private get parseResult(): ParseResult {
        const fnNames = this._mathCxt ? this._mathCxt.fnNames : [];
        return parseCalchub(this._expr, fnNames);
    }

    @computed
    get primitiveNumber(): number {
        return this.resolver.primitiveNumber;
    }

    @computed
    get python(): string {
        return this.shallowTree ? this.shallowTree.toPython().expr : '';
    }

    @computed
    get shallowTree(): INode {
        const parseResult = this.parseResult;
        return (parseResult && parseResult.root) ? parseResult.root.only : null;
    }

    @computed
    get symbol(): string {
        return this._symbol;
    }

    @computed
    get tokens(): Token[] {
        return this.parseResult.tokens;
    }

    @computed
    get units(): string {
        return this._units;
    }

    @action
    clone(): MathExpr {
        const { id, ...props } = this.toJS();
        return MathExpr.fromProps(props);
    }

    @action
    updateExpr(expr: string = '') {
        this._parseError = null;
        this._fnName = null;
        this._symbol = null;

        // here we want to set non-cxt dependent properties
        // like fnName, symbol, isFunctionDefinition, isVariable
        // etc. to avoid unnecessary expensive computations

        const fnNames = this._mathCxt ? this._mathCxt.fnNames : [];
        const { root, error } = parseCalchub(expr, fnNames);

        if (error || !root.only) {
            // the parser was not able to
            // form a valid AST
            this._expr = expr;
            return;
        }

        if (isFuncDefinitionTree(root.only)) {
            const left = root.only.left as FuncDefinitionNode;
            this._fnName = left.fnName;
        }

        if (isVarDefinitionTree(root.only)) {
            this._symbol = (root.only.left as SymbolNode).symbol;
        }

        this._expr = expr;
    }

    @action
    applyProps(props?: MathExprProps) {
        if (props == null) return;
        if (props.expr != null) this.updateExpr(props.expr);
        if (props.color != null) this._color.updateFromStr(props.color);
        if (props.description != null) this._description = props.description;
        if (props.units !== undefined) this._units = props.units;
    }

    @action
    setContext(cxt: MathContext) {
        this._mathCxt = cxt;
    }

    toJS(): MathExprProps {
        return omitNulls({
            id: this.id,
            expr: this.expr,
            color: this.color.rgbStr,
            description: this.description,
            units: this.units,
        });
    }

    static fromProps(props: MathExprProps): MathExpr {
        const e = new MathExpr(props.id);
        e.applyProps(props);
        return e;
    }

    @action
    static fromExpr(expr: string): MathExpr {
        const e = new MathExpr();
        e.applyProps({ expr });
        return e;
    }
}

function formulaRoot(node: INode): INode {
    if (isAssignment(node)) {
        return node.right;
    }
    return node;
}
