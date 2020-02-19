import { expect } from 'chai';
import * as sinon from 'sinon';
import { EventType, MathContext, MathExpr } from '../../internal';

describe('History', () => {

    it('emits change event on update', () => {
        const cxt = new MathContext();

        const changeStub = sinon.stub();
        cxt.bus.addListener(EventType.Change, changeStub);

        const expr = new MathExpr();
        expr.updateExpr('10');
        cxt.addExpr(expr);

        expect(changeStub.callCount).to.eq(1);

        expr.updateExpr('x = 10');

        expect(changeStub.callCount).to.eq(2);
        const evt = changeStub.getCall(1).args[0];
        expect(evt.changeSet[0]).to.deep.eq({
            type: 'expr_u',
            id: expr.id,
            newProps: {
                expr: 'x = 10',
            },
            oldProps: {
                expr: '10',
            }
        });
    });
});
