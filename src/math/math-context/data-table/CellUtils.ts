export const CELL_LOC_REGEX = /^(\$?[A-Za-z]+)\$?([0-9]+)$/;

export function isValidCellLoc(loc: string): boolean {
    return CELL_LOC_REGEX.test(loc);
}

export function parseCellLoc(loc: string): { row: string, column: string } {
    if (loc == null) return null;
    const match = loc.match(CELL_LOC_REGEX);

    if (match == null) {
        return {
            column: null,
            row: null,
        };
    }

    return {
        column: match[1],
        row: match[2],
    }
}

export function alphaToNumber(str: number | string): number {
    if (typeof str === 'number') {
        return str;
    }

    const alpha = charRange('A', 'Z');
    let result = 0;

    // make sure we have a usable string
    str = str.toUpperCase();
    str = str.replace(/[^A-Z]/g, '');

    // we're incrementing j and decrementing i
    let j = 0;
    for (let i = str.length - 1; i > -1; i--) {
        // get letters in reverse
        const char = str[i];

        // get index in alpha and compensate for
        // 0 based array
        let position = alpha.indexOf(char);
        position++;

        // the power kinda like the 10's or 100's
        // etc... position of the letter
        // when j is 0 it's 1s
        // when j is 1 it's 10s
        // etc...
        const power = Math.pow(26, j);

        // add the power and index to result
        result += power * position;
        j++;
    }

    return result;
}

export function numberToAlpha(num: number | string): string {
    if (typeof num === 'string') {
        return num;
    }

    const alpha = charRange('A', 'Z');
    let result = '';

    // no letters for 0 or less
    if (num < 1) {
        return result;
    }

    let quotient = num;
    let remainder = 0;

    // until we have a 0 quotient
    while (quotient !== 0) {
        // compensate for 0 based array
        const decremented = quotient - 1;

        // divide by 26
        quotient = Math.floor(decremented / 26);

        // get remainder
        remainder = decremented % 26;

        // prepend the letter at index of remainder
        result = alpha[remainder] + result;
    }

    return result;
}

export function alphaAtOffset(alpha: string, colOffset: number, rowOffset: number): string {
    colOffset = colOffset == null ? 0 : colOffset;
    rowOffset = rowOffset == null ? 0 : rowOffset;

    const { tableName, cell1, cell2 } = parseAlpha(alpha);

    if (cell1 == null) {
        return null;
    }

    let nextCell1 = null;
    let nextCell2 = null;

    if (cell1 != null) {
        const { col, row, colAbs, rowAbs } = cell1;
        const nextCol = colAbs ? '$' + col : numberToAlpha(Math.max(1, alphaToNumber(col) + colOffset));
        const nextRow = rowAbs ? '$' + row : Math.max(1, (Number(row) + rowOffset)).toString();
        nextCell1 = nextCol + nextRow;
    }

    if (cell2 != null) {
        const { col, row, colAbs, rowAbs } = cell2;
        const nextCol = colAbs ? '$' + col : numberToAlpha(Math.max(1, alphaToNumber(col) + colOffset));
        const nextRow = rowAbs ? '$' + row : Math.max(1, (Number(row) + rowOffset)).toString();
        nextCell2 = nextCol + nextRow;
    }

    let nextAlpha = '';
    if (tableName) {
        nextAlpha += tableName + '!' + nextCell1;
    } else {
        nextAlpha += nextCell1;
    }

    if (nextCell2) {
        nextAlpha += ':' + nextCell2;
    }

    return nextAlpha;
}

// REGEX Helpers
// -------------------------------

const ALPHA_RE = /^((Table\d+)!)?((\$)?([A-Za-z]+)(\$)?(\d+))(:((\$)?([A-Za-z]+)(\$)?(\d+)))?$/;

export interface IAlphaParseResult {
    tableName?: string;
    cell1?: {
        alpha: string;
        col: string;
        colAbs: boolean;
        row: string;
        rowAbs: boolean;
    };
    cell2?: {
        alpha: string;
        col: string;
        colAbs: boolean;
        row: string;
        rowAbs: boolean;
    };
}

export function parseAlpha(alpha: string): IAlphaParseResult {
    const match = alpha && alpha.match(ALPHA_RE);

    if (match == null) {

        return {
            tableName: null,
            cell1: null,
            cell2: null,
        };
    }

    const result: IAlphaParseResult = {
        tableName: match[2],
    };

    const cell1Alpha = match[3];
    const cell1ColIsAbs = !!match[4];
    const cell1ColAlpha = match[5];
    const cell1RowIsAbs = !!match[6];
    const cell1RowAlpha = match[7];

    if (cell1Alpha != null) {
        result.cell1 = {
            alpha: cell1Alpha,
            col: cell1ColAlpha,
            colAbs: cell1ColIsAbs,
            row: cell1RowAlpha,
            rowAbs: cell1RowIsAbs,
        }
    }

    const cell2Alpha = match[9];
    const cell2ColIsAbs = !!match[10];
    const cell2ColAlpha = match[11];
    const cell2RowIsAbs = !!match[12];
    const cell2RowAlpha = match[13];

    if (cell2Alpha != null) {
        result.cell2 = {
            alpha: cell2Alpha,
            col: cell2ColAlpha,
            colAbs: cell2ColIsAbs,
            row: cell2RowAlpha,
            rowAbs: cell2RowIsAbs,
        }
    }

    return result;
}

// Table Cell: eg A1, ZB100, b4, $A$1
// -----------------------

export function isTableCell(word: string): boolean {
    if (word == null) {
        return false;
    }

    const res = parseAlpha(word);
    return !!res && !res.tableName && !!res.cell1 && !res.cell2;
}

// Fully Qualified Table Cell: eg Table1!A1, Table13!b9
// ------------------------------------------------------

export function isFQTableCellRef(word: string): boolean {
    const res = parseAlpha(word);
    return !!res && !!res.tableName && !!res.cell1 && !res.cell2;
}

// Range: like A1:F4
// ----------------------------

export function isLocalTableRange(target: string): boolean {
    const res = parseAlpha(target);
    return !!res && !res.tableName && !!res.cell1 && !!res.cell2;
}

// Fully Qualified Table Range: eg Table1!A4:G7
// ----------------------------

export function isFQTableRange(word: string): boolean {
    const res = parseAlpha(word);
    return !!res && !!res.tableName && !!res.cell1 && !!res.cell2;
}

// Table Name: eg Table22
// ----------------------------

const TABLE_NAME_REGEX = /^Table[\d]+$/;

export function isTableName(word: string): boolean {
    return TABLE_NAME_REGEX.test(word);
}

// Builds a char range
// ----------------------------

function charRange(start: string, stop: string) {
    const result = [];

    let i = start.charCodeAt(0);
    const last = stop.charCodeAt(0) + 1;
    for (i; i < last; i++) {
        result.push(String.fromCharCode(i));
    }

    return result;
}

export function parseRawTableData(raw: string): string[][] {
    // split string on new lines
    const rows = raw.split('\n');
    return rows.map(row => {
        return row.split('\t');
    });
}

export function generateOffsetCellExpr(expr: string, colOffset: number, rowOffset: number): string {
    return expr;
    // TODO: not currently used
    // const { tokens } = tokenize(expr);
    // let arr = expr.split('');
    //
    // tokens.forEach(token => {
    //     if (isCellOrRangeRef(token) || (token.type === TokenType.Word && isTableCell(token.value))) {
    //         const alphaOffset = alphaAtOffset(token.value, colOffset, rowOffset);
    //         const input = Array(token.length - 1).fill('');
    //         input.unshift(alphaOffset);
    //         arr.splice(token.start, token.length, ...input);
    //     }
    // });
    //
    // return arr.join('');
}
