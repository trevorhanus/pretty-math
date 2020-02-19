import { action, computed, observable } from 'mobx';
import { alphaToNumber, isTableCell, numberToAlpha, parseAlpha } from '../../internal';

export enum CellDir {
    Up,
    Right,
    Down,
    Left,
}

export interface ICellOpts {
    absCol?: boolean;
    absRow?: boolean;
}

export class Cell {
    @observable readonly col: number;
    @observable readonly row: number;
    @observable private _absCol: boolean;
    @observable private _absRow: boolean;

    constructor(col: number, row: number, opts: ICellOpts = {}) {
        this.col = col;
        this.row = row;
        this._absCol = !!opts.absCol;
        this._absRow = !!opts.absRow;
    }

    @computed
    get colAlpha(): string {
        const bling = this._absCol ? '$' : '';
        return bling + numberToAlpha(this.col);
    }

    @computed
    get rowAlpha(): string {
        const bling = this._absRow ? '$' : '';
        return bling + this.row.toString();
    }

    @computed
    get alpha(): string {
        return this.colAlpha + this.rowAlpha;
    }

    equals(cell: Cell): boolean {
        if (cell == null) {
            return false;
        }
        return this.alpha === cell.alpha;
    }

    next(dir: CellDir): Cell {
        let row = this.row;
        let col = this.col;

        switch (dir) {

            case CellDir.Up:
                row = row - 1;
                break;

            case CellDir.Right:
                col = col + 1;
                break;

            case CellDir.Down:
                row = row + 1;
                break;

            case CellDir.Left:
                col = col - 1;
        }

        if (row < 1 || col < 1) {
            return new Cell(this.col, this.row);
        }

        return new Cell(col, row);
    }

    offset(cols: number, rows: number): Cell {
        cols = cols != null ? cols : 0;
        rows = rows != null ? rows : 0;
        const newCol = Math.max(1, this.col + cols);
        const newRow = Math.max(1, this.row + rows);
        return new Cell(newCol, newRow);
    }

    @action
    applyAlpha(alpha: string) {
    }

    static fromAlpha(alpha: string): Cell {
        if (!isTableCell(alpha)) {
            return null;
        }

        const upper = alpha.toUpperCase();

        const { cell1 } = parseAlpha(upper);

        if (cell1 == null) {
            return null;
        }

        const col = alphaToNumber(cell1.col);
        const row = Number(cell1.row);

        return new Cell(col, row, { absCol: cell1.colAbs, absRow: cell1.rowAbs });
    }
}