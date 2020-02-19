import { alphaToNumber, Cell, parseAlpha, parseCellLoc } from '../../internal';

export class Range {
    start: Cell;
    end: Cell;

    constructor(c1: Cell, c2?: Cell) {
        c2 = c2 || c1;
        // find corners
        const top = Math.min(c1.row, c2.row);
        const right = Math.max(c1.col, c2.col);
        const bottom = Math.max(c1.row, c2.row);
        const left = Math.min(c1.col, c2.col);
        this.start = new Cell(left, top);
        this.end = new Cell(right, bottom);
    }

    get alpha(): string {
        if (this.isSingle) {
            return this.start.alpha;
        } else {
            return this.start.alpha + ':' + this.end.alpha;
        }
    }

    get only(): Cell {
        if (this.start.equals(this.end)) {
            return this.start;
        } else {
            return null;
        }
    }

    get isSingle(): boolean {
        return this.only != null;
    }

    get isRowOnly(): boolean {
        return this.start.row === this.end.row;
    }

    get isColumnOnly(): boolean {
        return this.start.col === this.end.col;
    }

    get numCols(): number {
        return this.end.col - this.start.col + 1;
    }

    get numRows(): number {
        return this.end.row - this.start.row + 1;
    }

    get firstRow(): Cell[] {
        const row = this.start.row;

        const firstRow: Cell[] = [];
        let col = this.start.col;
        for (col; col <= this.end.col; col++) {
            const cell = new Cell(col, row);
            firstRow.push(cell);
        }

        return firstRow;
    }

    get rows(): Cell[][] {
        const rows: Cell[][] = [];
        let rowNum = this.start.row;

        for (rowNum; rowNum <= this.end.row; rowNum++) {
            let col = this.start.col;
            const row: Cell[] = [];
            for (col; col <= this.end.col; col++) {
                const cell = new Cell(col, rowNum);
                row.push(cell);
            }
            rows.push(row);
        }
        return rows;
    }

    get flatRows(): Cell[] {
        return this.rows.reduce((s, c) => s.concat(c));
    }

    get cols(): Cell[][] {
        const cols: Cell[][] = [];
        let colNum = this.start.col;

        for (colNum; colNum <= this.end.col; colNum++) {
            let row = this.start.row;
            const col: Cell[] = [];
            for (row; row <= this.end.row; row++) {
                const cell = new Cell(colNum, row);
                col.push(cell);
            }
            cols.push(col);
        }
        return cols;
    }

    get flatCols(): Cell[] {
        return this.cols.reduce((s, c) => s.concat(c));
    }

    includes(cellLoc: string): boolean {
        const { row, column } = parseCellLoc(cellLoc);
        return this.includesRow(row) && this.includesCol(column);
    }

    includesRow(rowAlpha: string): boolean {
        if (rowAlpha == null) {
            return false;
        }

        const row = Number.parseInt(rowAlpha);

        if (Number.isNaN(row)) {
            return false;
        }

        return this.start.row <= row && this.end.row >= row;
    }

    includesCol(colAlpha: string): boolean {
        if (colAlpha == null) {
            return false;
        }

        const col = alphaToNumber(colAlpha);

        return this.start.col <= col && this.end.col >= col;
    }

    // for each should traverse each row from top to bottom
    forEach(iterator: (cell: Cell) => void) {
        let row = this.start.row;

        for (row; row <= this.end.row; row++) {
            let col = this.start.col;
            for (col; col <= this.end.col; col++) {
                const cell = new Cell(col, row);
                iterator(cell);
            }
        }
    }

    forEachRow(iterator: (row: Cell[]) => void) {
        let rowNum = this.start.row;

        for (rowNum; rowNum <= this.end.row; rowNum++) {
            let col = this.start.col;
            const row: Cell[] = [];
            for (col; col <= this.end.col; col++) {
                const cell = new Cell(col, rowNum);
                row.push(cell);
            }
            iterator(row);
        }
    }

    equals(range: Range): boolean {
        if (range == null) {
            return false;
        }
        return this.start.equals(range.start) && this.end.equals(range.end);
    }

    offset(cols: number, rows: number): Range {
        return new Range(this.start.offset(cols, rows), this.end.offset(cols, rows));
    }

    static fromAlpha(rangeAlpha: string): Range {
        const parsed = parseAlpha(rangeAlpha);

        if (parsed == null) {
            return null;
        }

        const { cell1, cell2 } = parsed;
        const c1 = Cell.fromAlpha(cell1.alpha);
        const c2 = cell2 != null ? Cell.fromAlpha(cell2.alpha) : null;
        return new Range(c1, c2);
    }
}
