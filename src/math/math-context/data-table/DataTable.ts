import { action, computed, observable, ObservableMap } from 'mobx';
import {
    DataTableCell,
    IDataTable,
    IDataTableProps,
    isValidCellLoc,
    MathContext,
    Range,
    invariant,
    omitNulls
} from '../../internal';

export class DataTable implements IDataTable {
    @observable private _tableName: string;
    private _cells: ObservableMap<DataTableCell>;
    @observable.ref private _cxt: MathContext;

    constructor(tableName?: string) {
        this._tableName = tableName;
        this._cells = observable.map<DataTableCell>();
        this._cxt = null;
    }

    @computed
    get tableName(): string {
        return this._tableName;
    }

    @computed
    get cxt(): MathContext {
        return this._cxt;
    }

    getCell(alpha: string): DataTableCell {
        alpha = alpha.replace(/\$/g, '');
        return this._cells.get(alpha);
    }

    getRange(alpha: string): DataTableCell[] {
        alpha = alpha.replace(/\$/g, '');
        const range = Range.fromAlpha(alpha);

        const cells: DataTableCell[] = [];
        range.forEach(cell => {
            const expr = this.getCell(cell.alpha);
            cells.push(expr);
        });

        return cells;
    }

    @action
    setCell(alpha: string, expr?: string) {
        alpha = alpha.replace(/\$/g, '');

        validateCellLoc(alpha);

        if (expr == null || expr === '') {
            this._cells.delete(alpha);
        } else {
            const cell = new DataTableCell(alpha, this);
            cell.setExpr(expr);
            this._cells.set(alpha, cell);
        }
    }

    @action
    applyProps(props?: IDataTableProps) {
        if (props == null) return;
        if (props.cells != null) {
            for (const cellLoc in props.cells) {
                const cellProps = props.cells[cellLoc];
                if (cellProps === null) {
                    // then we need to delete the cell
                    this.setCell(cellLoc, null);
                } else {
                    const { expr } = props.cells[cellLoc];
                    this.setCell(cellLoc, expr);
                }
            }
        }
    }

    @action
    setTableName(name: string) {
        this._tableName = name;
    }

    @action
    setContext(cxt: MathContext) {
        this._cxt = cxt;
    }

    toJS(): IDataTableProps {
        const props: IDataTableProps = {
            tableName: this.tableName,
            cells: null,
        };

        if (this._cells.size > 0) {
            props.cells = {};
            this._cells.forEach((expr, loc) => {
                props.cells[loc] = { expr: expr.expr };
            });
        }

        return omitNulls(props);
    }
}

export function validateCellLoc(loc: string) {
    invariant(!isValidCellLoc(loc), `Invalid cell loc ${loc}`);
}
