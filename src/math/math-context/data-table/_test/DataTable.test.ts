import { expect } from 'chai';
import { autorun } from 'mobx';
import { DataTable, MathContext, MathExpr } from '../../../internal';

describe('DataTable', () => {

    describe('constructor', () => {

        it('no id', () => {
            const dt = new DataTable();
            expect(dt).to.be.ok;
            expect(dt.tableName).to.eq(undefined);
            expect(dt.getCell('A1')).to.be.undefined;
        });

        it('with id', () => {
            const dt = new DataTable('Table1');
            expect(dt).to.be.ok;
            expect(dt.tableName).to.eq('Table1');
            expect(dt.getCell('A1')).to.be.undefined;
        });
    });

    describe('setCell', () => {

        it('simple set', () => {
            const dt = new DataTable('Table1');

            let v = '';
            autorun(() => {
                const c = dt.getCell('A1');
                v = c != null ? c.expr : '';
            });

            expect(v).to.eq('');
            dt.setCell('A1', '10');
            expect(v).to.eq('10');
            dt.setCell('A1', '');
            expect(v).to.eq('');
        });

        it('throws on invalid key', () => {
            const dt = new DataTable('Table1');

            expect(() => {
                dt.setCell('foo', '10');
            }).to.throw();
        });

        it('cell has error on invalid expr', () => {
            const dt = new DataTable('Table1');

            dt.setCell('A1', '=@');

        });
    });

    describe('getRange', () => {

        it('single cell', () => {
            const dt = new DataTable('Table1');
            dt.setCell('A2', '10');
            const range = dt.getRange('A2');
            expect(range[0].primitiveNumber).to.eq(10);
        });

        it('column', () => {
            const dt = new DataTable('Table1');
            dt.setCell('A2', '10');
            const range = dt.getRange('A1:A10');
            expect(range.length).to.eq(10);
            expect(range[1].expr).to.eq('10');
        });

        it('row', () => {
            const dt = new DataTable('Table1');
            dt.setCell('Z10', '2');
            const range = dt.getRange('A10:AA10');
            expect(range.length).to.eq(27);
            expect(range[25].expr).to.eq('2');
        });
    });

    xdescribe('reference cells', () => {

        it('not part of context', () => {
            const dt = new DataTable('Table1');
            dt.setCell('A1', '10');
            dt.setCell('A2', '=A1*10');
            const val = dt.getCell('A2').primitiveNumber;
            expect(dt.getCell('A2').primitiveNumber).to.be.closeTo(100, 0.01);
        });

        it('part of math context', () => {
            const cxt = new MathContext();
            const dt = new DataTable('Table1');
            dt.setCell('A1', '10');
            dt.setCell('A2', '=A1*10');

            cxt.addDataTable(dt);

            expect(dt.getCell('A2').primitiveNumber).to.be.closeTo(100, 0.01);
        });

        it('reference another table', () => {
            const cxt = new MathContext();
            const dt1 = new DataTable('Table1');
            dt1.setCell('A1', '10');

            const dt2 = new DataTable('Table2');
            dt2.setCell('A1', '=Table1!A1 * 10');

            cxt.addDataTable(dt1);
            cxt.addDataTable(dt2);

            const cell = cxt.getTableCell('Table2!A1');
            expect(cell.primitiveNumber).to.be.closeTo(100, 0.01);
        });

        it('reference a variable', () => {
            const cxt = new MathContext();
            const dt1 = new DataTable('Table1');
            dt1.setCell('A1', '=a * 10');

            const a = new MathExpr();
            a.applyProps({
                expr: 'a = 10',
            });

            cxt.addDataTable(dt1);
            cxt.addExpr(a);

            const cell = cxt.getTableCell('Table1!A1');
            expect(cell.primitiveNumber).to.be.closeTo(100, 0.01);
        });

        it('references from multiple tables', () => {
            const cxt = new MathContext();
            const dt1 = new DataTable('Table1');
            dt1.setCell('A1', '=10');

            const dt2 = new DataTable('Table2');
            dt2.setCell('A1', '=\\sqrt(4)');

            const a = new MathExpr();
            a.applyProps({
                expr: 'Table1!A1 * Table2!A1',
            });

            cxt.addDataTable(dt1);
            cxt.addDataTable(dt2);
            cxt.addExpr(a);

            expect(a.resolver.primitiveNumber).to.eq(20);
        });

        it('reference with lowercase column', () => {
            const cxt = new MathContext();
            const dt1 = new DataTable('table1');
            dt1.setCell('A1', '=10');
            dt1.setCell('A2', '=a1');

            cxt.addDataTable(dt1);

            expect(dt1.getCell('A2').primitiveNumber).to.be.closeTo(100, 0.01);
        });

        it('absolute cell alpha', () => {
            const cxt = new MathContext();
            const dt1 = new DataTable('table1');
            dt1.setCell('A1', '=10');
            dt1.setCell('A2', '=$A$1');

            cxt.addDataTable(dt1);

            expect(dt1.getCell('A2').primitiveNumber).to.be.closeTo(10, 0.01);
        });

        it('absolute cell alpha', () => {
            const cxt = new MathContext();
            const dt1 = new DataTable('table1');
            dt1.setCell('A1', '=10');
            dt1.setCell('A2', '=A$1');

            cxt.addDataTable(dt1);

            expect(dt1.getCell('A2').primitiveNumber).to.be.closeTo(10, 0.01);
        });
    });

    describe('applyProps and toJS', () => {

        it('can apply props', () => {
            const dt = new DataTable('Table1');

            const props = {
                tableName: 'Table1',
                cells: {
                    'A1': { expr: '1' },
                    'A2': { expr: '2' },
                    'A3': { expr: '3' },
                    'A4': { expr: '4' },
                    'ZA1': { expr: '5' },
                },
            };

            dt.applyProps(props);

            expect(dt.getCell('A1').expr).to.eq('1');
            expect(dt.getCell('A2').expr).to.eq('2');
            expect(dt.getCell('ZA1').expr).to.eq('5');
            expect(dt.toJS()).to.deep.eq(props);
        });
    });
});
