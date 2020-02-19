import { Decimal } from 'decimal.js';
import { action, computed, observable } from 'mobx';
import {
    DataTable,
    ErrorType,
    IDataTableCell,
    INode,
    isLiteralFam,
    LiteralNode,
    MathContext,
    parseCalchub,
    Token
} from '../../internal';

export class DataTableCell implements IDataTableCell {
    private _loc: string;
    private _table: DataTable;
    @observable private _expr: string;
    @observable private _literalValue: Decimal;
    @observable.ref private _tokens: Token[];
    @observable.ref private _root: INode;

    constructor(loc: string, table: DataTable) {
        this._loc = loc;
        this._literalValue = null;
        this._table = table;
        this._expr = '';
    }

    get loc(): string {
        return this._loc;
    }

    @computed
    get cxt(): MathContext {
        return this._table != null ? this._table.cxt : null;
    }

    @computed
    get expr(): string {
        return this._expr;
    }

    @computed
    get tokens(): Token[] {
        return this._tokens;
    }

    @computed
    get eval(): INode {

        if (this.isMath) {
            try {
                return this._root.simplify();
            } catch (e) {
                return LiteralNode.NaN();
            }
        }

        return LiteralNode.NaN();
    }

    @computed
    get primitiveNumber(): number {
        return (this.eval && this.eval.decimal) ? this.eval.decimal.toNumber() : NaN;
    }

    @computed
    get isMath(): boolean {
        return this._root != null;
    }

    @computed
    get isString(): boolean {
        return !this.isMath;
    }

    @action
    setExpr(expr: string) {
        this._tokens = null;
        this._root = null;

        if (isFormula(expr)) {
            // is a formula, attempt to parse it
            const exprSansEquals = expr.slice(1);
            const { tokens, error, root } = parseCalchub(exprSansEquals);
            if (error) {
                const { message } = error;
            } else {
                this._tokens = tokens;
                this._root = root.only;
            }
        } else {
            // else it's not a formula,
            // parse it and see if it's a literal
            try {
                const { root } = parseCalchub(expr);
                if (isLiteralFam(root.only)) {
                    this._root = root.only;
                }
            } catch (e) {
                // ignore
            }
        }

        this._expr = expr;
    }
}

const EXPR_REGEX = /^\s*=/;
function isFormula(expr: string): boolean {
    return EXPR_REGEX.test(expr);
}
