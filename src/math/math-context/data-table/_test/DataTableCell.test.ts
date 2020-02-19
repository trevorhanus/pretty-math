import { expect } from 'chai';
import { autorun } from 'mobx';
import { DataTableCell } from '../../../internal';

describe('DataTableCell', () => {

    it('initialization', () => {
        const cell = new DataTableCell('A1', null);
        expect(cell.isMath).to.be.false;
        expect(cell.isString).to.be.true;
        expect(cell.loc).to.eq('A1');
        expect(cell.expr).to.eq('');
    });

    xit('setExpr', () => {
        const cell = new DataTableCell('A1', null);

        let v = '';
        autorun(() => {
            v = toJS(cell);
        });

        cell.setExpr('=10');

        expect(v).to.include({
            isMath: true,
            isString: false,
            hasError: false,
        });

        cell.setExpr('10');

        expect(v).to.include({
            isMath: true,
            isString: false,
            hasError: false,
            number: 10,
        });

        cell.setExpr('some funny stuff');

        expect(v).to.include({
            isMath: false,
            isString: true,
            hasError: false,
            expr: 'some funny stuff',
        });

        cell.setExpr('=4*');

        expect(v, '=4*').to.include({
            isMath: false,
            isString: false,
            hasError: true,
        });

        cell.setExpr('4e2');

        expect(v, '4e2').to.include({
            isMath: true,
            isString: false,
            hasError: false,
        });

        cell.setExpr('= 10 + 5');

        expect(v, '= 10 + 5').to.include({
            isMath: true,
            isString: false,
            hasError: false,
        });

        cell.setExpr('10 + 5');

        expect(v, '10 + 5').to.include({
            isMath: false,
            isString: true,
            hasError: false,
            expr: '10 + 5',
        });

        cell.setExpr('=$A$2');

        expect(v, '=$A$2').to.include({
            isMath: true,
            isString: false,
            hasError: false,
        });
    });

});

function toJS(cell: DataTableCell): any {
    return {
        isMath: cell.isMath,
        isString: cell.isString,
        expr: cell.expr,
        number: cell.primitiveNumber,
    }
}
