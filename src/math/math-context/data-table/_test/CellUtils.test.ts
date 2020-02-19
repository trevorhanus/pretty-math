import { expect } from 'chai';
import { alphaAtOffset, alphaToNumber, Cell, numberToAlpha, parseAlpha, parseCellLoc, Range } from '../../../internal';

describe('CellUtils', () => {

    it('parseAlpha', () => {
        [
            {
                alpha: 'A1',
                expectation: {
                    cell1: {
                        alpha: 'A1',
                        col: 'A',
                        colAbs: false,
                        row: '1',
                        rowAbs: false,
                    },
                }
            },
            {
                alpha: 'A1:y7',
                expectation: {
                    cell1: {
                        alpha: 'A1',
                        col: 'A',
                        colAbs: false,
                        row: '1',
                        rowAbs: false,
                    },
                    cell2: {
                        alpha: 'y7',
                        col: 'y',
                        colAbs: false,
                        row: '7',
                        rowAbs: false,
                    },
                }
            },
            {
                alpha: 'A1:A2',
                expectation: {
                    cell1: {
                        alpha: 'A1',
                        col: 'A',
                        colAbs: false,
                        row: '1',
                        rowAbs: false,
                    },
                    cell2: {
                        alpha: 'A2',
                        col: 'A',
                        colAbs: false,
                        row: '2',
                        rowAbs: false,
                    },
                }
            },
            {
                alpha: 'd5:b4',
                expectation: {
                    cell1: {
                        alpha: 'd5',
                        col: 'd',
                        colAbs: false,
                        row: '5',
                        rowAbs: false,
                    },
                    cell2: {
                        alpha: 'b4',
                        col: 'b',
                        colAbs: false,
                        row: '4',
                        rowAbs: false,
                    },
                }
            },
            {
                alpha: 'Table1!b2',
                expectation: {
                    tableName: 'Table1',
                    cell1: {
                        alpha: 'b2',
                        col: 'b',
                        colAbs: false,
                        row: '2',
                        rowAbs: false,
                    },
                }
            },
            {
                alpha: 'Table1!b2:C5',
                expectation: {
                    tableName: 'Table1',
                    cell1: {
                        alpha: 'b2',
                        col: 'b',
                        colAbs: false,
                        row: '2',
                        rowAbs: false,
                    },
                    cell2: {
                        alpha: 'C5',
                        col: 'C',
                        colAbs: false,
                        row: '5',
                        rowAbs: false,
                    },
                }
            },
            {
                alpha: '$A1',
                expectation: {
                    cell1: {
                        alpha: '$A1',
                        col: 'A',
                        colAbs: true,
                        row: '1',
                        rowAbs: false,
                    },
                }
            },
            {
                alpha: '$A$1:$B$2',
                expectation: {
                    cell1: {
                        alpha: '$A$1',
                        col: 'A',
                        colAbs: true,
                        row: '1',
                        rowAbs: true,
                    },
                    cell2: {
                        alpha: '$B$2',
                        col: 'B',
                        colAbs: true,
                        row: '2',
                        rowAbs: true,
                    },
                }
            },
            {
                alpha: 'Table20!A$1:$B2',
                expectation: {
                    tableName: 'Table20',
                    cell1: {
                        alpha: 'A$1',
                        col: 'A',
                        colAbs: false,
                        row: '1',
                        rowAbs: true,
                    },
                    cell2: {
                        alpha: '$B2',
                        col: 'B',
                        colAbs: true,
                        row: '2',
                        rowAbs: false,
                    },
                }
            },
            {
                alpha: 'Table1!AA1:CD2',
                expectation: {
                    tableName: 'Table1',
                    cell1: {
                        alpha: 'AA1',
                        col: 'AA',
                        colAbs: false,
                        row: '1',
                        rowAbs: false,
                    },
                    cell2: {
                        alpha: 'CD2',
                        col: 'CD',
                        colAbs: false,
                        row: '2',
                        rowAbs: false,
                    },
                }
            },
            {
                alpha: 'Table12!AAA1234',
                expectation: {
                    tableName: 'Table12',
                    cell1: {
                        alpha: 'AAA1234',
                        col: 'AAA',
                        colAbs: false,
                        row: '1234',
                        rowAbs: false,
                    },
                }
            }
        ].forEach(test => {
            const { alpha, expectation } = test;
            const actual = parseAlpha(alpha);
            expect(actual).to.deep.include(expectation);
        });
    });

    it('parseAlpha - invalid', () => {
        [
            {
                description: 'no cell1',
                alpha: ':A1',
            },
            {
                description: 'invalid chars',
                alpha: 'tab=:A1',
            },
        ].forEach(test => {
            const { alpha } = test;
            const actual = parseAlpha(alpha);
            expect(actual).to.deep.eq({ tableName: null, cell1: null, cell2: null });
        });
    });

    it('parseCell - good values', () => {

        [
            {
                cell: 'A1',
                expected: {
                    column: 'A',
                    row: '1',
                }
            },
            {
                cell: 'A100',
                expected: {
                    column: 'A',
                    row: '100',
                }
            },
        ].forEach(test => {
            const { cell, expected } = test;
            const actual = parseCellLoc(cell);
            expect(actual).to.deep.eq(expected);
        });
    });

    it('parseCell - errors', () => {

        [
            {
                description: 'invalid chars',
                loc: ':',
            }
        ].forEach(test => {
            const { description, loc } = test;
            const res = parseCellLoc(loc);
            expect(res.column).to.eq(null);
            expect(res.row).to.eq(null);
        });
    });

    it('numberToAlpha, alphaToNum - OK values', () => {
        [
            {
                num: 1,
                alpha: 'A'
            },
            {
                num: 2,
                alpha: 'B'
            },
            {
                num: 26,
                alpha: 'Z'
            },
            {
                num: 27,
                alpha: 'AA'
            },
            {
                num: 676,
                alpha: 'YZ'
            },
            {
                num: 677,
                alpha: 'ZA'
            },
            {
                num: 702,
                alpha: 'ZZ'
            },
            {
                num: 703,
                alpha: 'AAA'
            },
        ].forEach(test => {
            const { num, alpha } = test;
            const actualAlpha = numberToAlpha(num);
            const actualNum = alphaToNumber(alpha);
            expect(actualAlpha).to.eq(alpha);
            expect(actualNum).to.eq(num);
        });
    });

    it('alphaAtOffset', () => {
        [
            {
                descr: 'all relative cell',
                given: 'A1',
                colOffset: 1,
                rowOffset: 2,
                result: 'B3',
            },
            {
                descr: 'column absolute',
                given: '$A1',
                colOffset: 1,
                rowOffset: 2,
                result: '$A3',
            },
            {
                descr: 'row absolute',
                given: 'A$1',
                colOffset: 3,
                rowOffset: -20,
                result: 'D$1',
            },
            {
                descr: 'all absolute',
                given: '$A$1',
                colOffset: 12,
                rowOffset: -10,
                result: '$A$1',
            },
            {
                descr: 'past boundaries',
                given: 'A1',
                colOffset: -2,
                rowOffset: -4,
                result: 'A1',
            },
            {
                descr: 'relative range',
                given: 'A1:D5',
                colOffset: 1,
                rowOffset: 10,
                result: 'B11:E15',
            },
            {
                descr: 'absolute rows range',
                given: 'A$1:D$5',
                colOffset: 2,
                rowOffset: 10,
                result: 'C$1:F$5',
            },
            {
                descr: 'with table name',
                given: 'Table1!A1:D5',
                colOffset: 1,
                rowOffset: 10,
                result: 'Table1!B11:E15',
            },
        ].forEach(test => {
            const { given, colOffset, rowOffset, result } = test;
            const actual = alphaAtOffset(given, colOffset, rowOffset);
            expect(actual).to.eq(result);
        });
    });

    describe('Cell', () => {

        it('init', () => {
            const c = new Cell(1, 1);
            expect(c.row).to.eq(1);
            expect(c.col).to.eq(1);
            expect(c.colAlpha).to.eq('A');
            expect(c.rowAlpha).to.eq('1');
            expect(c.equals(c)).to.be.true;
            expect(c.alpha).to.eq('A1');
        });

        it('abs col and row', () => {
            const c = new Cell(10, 11, { absCol: true, absRow: true });
            expect(c.col).to.eq(10);
            expect(c.row).to.eq(11);
            expect(c.colAlpha).to.eq('$J');
            expect(c.rowAlpha).to.eq('$11');
            expect(c.equals(c)).to.be.true;
            expect(c.alpha).to.eq('$J$11');
        });

        it('fromAlpha', () => {
            const Z2 = Cell.fromAlpha('Z2');
            expect(Z2.row).to.eq(2);
            expect(Z2.col).to.eq(26);

            const z2 = Cell.fromAlpha('z2');
            expect(z2.row).to.eq(2);
            expect(z2.col).to.eq(26);

            const e1 = Cell.fromAlpha(null);
            expect(e1).to.be.null;

            const e2 = Cell.fromAlpha('');
            expect(e2).to.be.null;

            const e3 = Cell.fromAlpha('foo');
            expect(e3).to.be.null;
        });

        it('offset', () => {
            const a1 = Cell.fromAlpha('A1');
            const c3 = a1.offset(2, 2);
            expect(c3.alpha).to.eq('C3');
        });

        it('offset past 1,1', () => {
            const b2 = Cell.fromAlpha('B2');
            const a1 = b2.offset(-3, -4);
            expect(a1.alpha).to.eq('A1');
        });
    });

    describe('Range', () => {

        it('init', () => {
            const r2 = new Range(new Cell(1, 1), new Cell(3, 3));
            expect(r2.isColumnOnly).to.be.false;
            expect(r2.isRowOnly).to.be.false;
            expect(r2.includes('A1')).to.be.true;
            expect(r2.includes('A2')).to.be.true;
            expect(r2.includes('B2')).to.be.true;
        });

        it('init one cell', () => {
            const r2 = new Range(new Cell(1, 1), new Cell(1, 1));
            expect(r2.isColumnOnly).to.be.true;
            expect(r2.isRowOnly).to.be.true;
            expect(r2.only.equals(new Cell(1, 1))).to.be.true;
            expect(r2.includes('A1')).to.be.true;
            expect(r2.includes('A2')).to.be.false;
        });

        it('init with one cell', () => {
            const r2 = new Range(new Cell(2, 2));
            expect(r2.isColumnOnly).to.be.true;
            expect(r2.isRowOnly).to.be.true;
            expect(r2.only.equals(new Cell(2, 2))).to.be.true;
            expect(r2.includes('A1')).to.be.false;
            expect(r2.includes('B2')).to.be.true;
        });

        it('init with cell2 behind cell1', () => {
            const r2 = new Range(new Cell(3, 3), new Cell(1, 1));
            expect(r2.isColumnOnly).to.be.false;
            expect(r2.isRowOnly).to.be.false;
            expect(r2.includes('A1')).to.be.true;
            expect(r2.includes('A2')).to.be.true;
            expect(r2.includes('B2')).to.be.true;
            expect(r2.includes('C3')).to.be.true;
            expect(r2.start.alpha).to.eq('A1');
            expect(r2.end.alpha).to.eq('C3');
        });

        it('forEach 2x2', () => {
            const r2 = Range.fromAlpha('A1:B2');
            const actual: string[] = [];
            r2.forEach(cell => {
                actual.push(cell.alpha);
            });
            const expected = ['A1', 'B1', 'A2', 'B2'];
            expect(expected).to.deep.eq(actual);
        });

        it('firstRow', () => {
            const r = Range.fromAlpha('A1:G10');
            expect(r.firstRow.map(cell => cell.col)).to.deep.eq([1, 2, 3, 4, 5, 6, 7]);

            const r2 = Range.fromAlpha('A1:A1');
            expect(r2.firstRow.map(cell => cell.col)).to.deep.eq([1]);
        });

        it('flatRows', () => {
            const r = Range.fromAlpha('A1:B2');
            expect(r.flatRows.map(c => c.alpha)).to.deep.eq(['A1', 'B1', 'A2', 'B2']);

            const r2 = Range.fromAlpha('A1:A1');
            expect(r2.flatRows.map(c => c.alpha)).to.deep.eq(['A1']);

            const r3 = Range.fromAlpha('G10:H11');
            expect(r3.flatRows.map(c => c.alpha)).to.deep.eq(['G10', 'H10', 'G11', 'H11']);
        });

        it('flatCols', () => {
            const r = Range.fromAlpha('A1:B2');
            expect(r.flatCols.map(c => c.alpha)).to.deep.eq(['A1', 'A2', 'B1', 'B2']);

            const r2 = Range.fromAlpha('A1:A1');
            expect(r2.flatCols.map(c => c.alpha)).to.deep.eq(['A1']);

            const r3 = Range.fromAlpha('G10:H11');
            expect(r3.flatCols.map(c => c.alpha)).to.deep.eq(['G10', 'G11', 'H10', 'H11']);
        });

        it('offset', () => {
            const r = Range.fromAlpha('A1:B2');
            const r2 = r.offset(3, 4);
            expect(r2.alpha).to.eq('D5:E6');

            const r3 = Range.fromAlpha('A1:A1');
            const r4 = r3.offset(-1, 2);
            expect(r4.alpha).to.eq('A3');
        });

        it('fromAlpha - one cell', () => {
            const r = Range.fromAlpha('A1');
            expect(r.start.col).to.eq(1);
            expect(r.start.row).to.eq(1);
            expect(r.isSingle).to.be.true;
        });
    });
});
