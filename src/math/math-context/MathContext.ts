import { action, computed, observable, ObservableMap } from 'mobx';
import {
    DataTable,
    DataTableCell,
    EventBus,
    EventEmitter,
    History,
    IMergeConflict,
    invariant,
    isString,
    MathContextProps,
    MathContextSettings,
    MathExpr,
    MathExprProps,
    parseAlpha
} from '../internal';

export class MathContext {
    private _dataTables: ObservableMap<string, DataTable>;
    private _exprs: ObservableMap<string, MathExpr>;
    private _eventEmitter: EventEmitter;
    bus: EventBus;
    history: History;
    // library: Library;
    settings: MathContextSettings;

    constructor() {
        this._dataTables = observable.map<string, DataTable>();
        this._exprs = observable.map<string, MathExpr>();
        this.bus = new EventBus();
        this.history = new History(this);
        // this.library = new Library(this);
        this._eventEmitter = new EventEmitter(this);
        this.settings = new MathContextSettings();
    }

    @computed
    get dataTables(): DataTable[] {
        return Array.from(this._dataTables.values());
    }

    @computed
    get exprs(): MathExpr[] {
        return Array.from(this._exprs.values());
    }

    @computed
    get funcs(): MathExpr[] {
        return this.exprs.filter(e => e.isFunctionDefinition);
    }

    @computed
    get fnNames(): string[] {
        return this.funcs.map(f => f.funcName);
    }

    @computed
    get vars(): MathExpr[] {
        return this.exprs.filter(e => e.isVariable);
    }

    getTableCell(fqCellLoc: string): DataTableCell {
        // parse the fully-qualified cell location
        const { tableName, cell1 } = parseAlpha(fqCellLoc);

        // try to find table
        const table = this._dataTables.get(tableName);

        if (table == null) {
            return null;
        }

        return table.getCell(cell1.alpha);
    }

    getTableRange(fqRangeLoc: string): DataTableCell[] {
        const { tableName, cell1, cell2 } = parseAlpha(fqRangeLoc);

        const table = this._dataTables.get(tableName);

        if (table == null) {
            return null;
        }

        let alpha = cell1.alpha;
        if (cell2) {
            alpha += ':' + cell2.alpha
        }

        return table.getRange(alpha);
    }

    getExprByName(name: string): MathExpr {
        return this.getVar(name) || this.getFunc(name);
    }

    getFunc(symbol: string): MathExpr {
        let f: MathExpr = null;
        for (let i = 0; i < this.exprs.length; i++) {
            const expr = this.exprs[i];
            if (expr.isFunctionDefinition && expr.funcName === symbol) {
                f = expr;
                break;
            }
        }
        return f;
    }

    getFuncsByFnName(fnName: string): MathExpr[] {
        const funcs: MathExpr[] = [];

        for (let i = 0; i < this.exprs.length; i++) {
            const expr = this.exprs[i];
            if (expr.isFunctionDefinition && expr.funcName === fnName) {
                funcs.push(expr);
            }
        }

        return funcs;
    }

    getVar(symbol: string): MathExpr {
        let v: MathExpr = null;
        for (let i = 0; i < this.exprs.length; i++) {
            const expr = this.exprs[i];
            if (expr.isVariable && expr.symbol === symbol) {
                v = expr;
                break;
            }
        }
        return v;
    }

    getVarsBySymbol(symbol: string): MathExpr[] {
        const vars: MathExpr[] = [];

        for (let i = 0; i < this.exprs.length; i++) {
            const expr = this.exprs[i];
            if (expr.isVariable && expr.symbol === symbol) {
                vars.push(expr);
            }
        }

        return vars;
    }

    hasFunc(fnName: string): boolean {
        let doesHave = false;
        for (let i = 0; i < this.exprs.length; i++) {
            const expr = this.exprs[i];
            if (expr.isFunctionDefinition && expr.funcName === fnName) {
                doesHave = true;
                break;
            }
        }
        return doesHave;
    }

    hasVar(symbol: string): boolean {
        let doesHave = false;
        for (let i = 0; i < this.exprs.length; i++) {
            const expr = this.exprs[i];
            if (expr.isVariable && expr.symbol === symbol) {
                doesHave = true;
                break;
            }
        }
        return doesHave;
    }

    getExprById(id: string): MathExpr {
        return this._exprs.has(id) ? this._exprs.get(id) : null;
    }

    hasExprById(id: string): boolean {
        return this._exprs.has(id);
    }

    createExpr(exprOrProps: string | MathExprProps): MathExpr {
        const props = (isString(exprOrProps) ? { expr: exprOrProps } : exprOrProps) as MathExprProps;
        const expr = new MathExpr(props.id);
        expr.applyProps(props);
        return expr;
    }

    @action
    addDataTable(dataTable: DataTable) {
        let tableName = dataTable.tableName;
        if (tableName == null) {
            tableName = this.getNextTableName();
        }

        if (this._dataTables.has(tableName)) {
            console.warn(`Attempted to add table with name '${tableName}' but one already exists.`);
            return;
        }

        dataTable.setTableName(tableName);
        dataTable.setContext(this);
        this._dataTables.set(dataTable.tableName, dataTable);
    }

    @action
    addExpr(expr: MathExpr) {
        if (this._exprs.has(expr.id)) return;
        expr.setContext(this);
        this._exprs.set(expr.id, expr);
    }

    @action
    removeExprById(id: string): MathExpr {
        if (!this._exprs.has(id)) {
            return null;
        }
        const expr = this._exprs.get(id);
        expr.setContext(null);
        this._exprs.delete(id);
        return expr;
    }

    @action
    removeDataTableByTableName(tableName: string): DataTable {
        if (!this._dataTables.has(tableName)) return null;
        const table = this._dataTables.get(tableName);
        if (table != null) {
            table.setContext(null);
        }
        this._dataTables.delete(tableName);
        return table;
    }

    getMergeConflicts(cxt: MathContext): IMergeConflict[] {
        const conflicts: IMergeConflict[] = [];
        // a merge conflict would exist if this context has defined a var
        // which is also defined in the merging cxt
        cxt.vars.forEach(v => {
            if (this.hasVar(v.symbol)) {
                const conflict = {
                    message: `Variable with symbol '${v.symbol}' already exists.`,
                    duplicateVar: v,
                };
                conflicts.push(conflict);
            }
        });
        return conflicts;
    }

    @action
    merge(cxt: MathContext) {
        const conflicts = this.getMergeConflicts(cxt);
        invariant(conflicts.length > 0, `cannot merge context. There are ${conflicts.length} merge conflicts`);
        cxt.exprs.forEach(e => {
            this.addExpr(e);
        });
    }

    toJS(): MathContextProps {
        return {
            dataTables: this.dataTables.map(table => table.toJS()),
            exprs: this.exprs.map(expr => expr.toJS()),
        };
    }

    private getNextTableName(): string {
        let number = 1;
        let tableName = '';

        while (true) {
            tableName = `Table${number}`;
            if (!this._dataTables.has(tableName)) {
                break;
            }
            number++;
        }

        return tableName;
    }

    static fromJS(props: MathContextProps): MathContext {
        invariant(props == null, `no props passed to MathContext.fromJS()`);
        const cxt = new MathContext();
        props.exprs.forEach(exprProps => {
            const expr = cxt.createExpr(exprProps);
            cxt.addExpr(expr);
        });
        return cxt;
    }
}
