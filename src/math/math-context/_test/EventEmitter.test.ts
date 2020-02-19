import { expect } from 'chai';
import * as sinon from 'sinon';
import { EventType, MathContext, MathExpr } from '../../internal';

describe('EventEmitter', () => {

    it('emits define var event on insert', () => {
        const cxt = new MathContext();

        const listenerStub = sinon.stub();
        cxt.bus.addListener(EventType.DefineVar, listenerStub);

        const expr = new MathExpr();
        expr.updateExpr('x = 10');

        cxt.addExpr(expr);

        expect(listenerStub.callCount).to.eq(1);
    });

    it('no define var event on update when expr does not change', () => {
        const cxt = new MathContext();

        const listenerStub = sinon.stub();
        cxt.bus.addListener(EventType.DefineVar, listenerStub);

        const expr = new MathExpr();
        expr.updateExpr('10');
        cxt.addExpr(expr);

        expect(listenerStub.callCount).to.eq(0);

        expr.applyProps({
            expr: '10',
            description: 'foo',
        });

        expect(listenerStub.callCount).to.eq(0);
    });

    it('emits define var event on expr update', () => {
        const cxt = new MathContext();

        const listenerStub = sinon.stub();
        cxt.bus.addListener(EventType.DefineVar, listenerStub);

        const expr = new MathExpr();
        expr.updateExpr('10');
        cxt.addExpr(expr);

        expect(listenerStub.callCount).to.eq(0);

        expr.updateExpr('x = 10');

        expect(listenerStub.callCount).to.eq(1);
    });

    it('emits define and delete events on update', () => {
        const cxt = new MathContext();

        const definefnStub = sinon.stub();
        const defineVarStub = sinon.stub();
        const deletefnStub = sinon.stub();
        const deleteVarStub = sinon.stub();

        cxt.bus.addListener(EventType.DefineFn, definefnStub);
        cxt.bus.addListener(EventType.DefineVar, defineVarStub);
        cxt.bus.addListener(EventType.DeleteFn, deletefnStub);
        cxt.bus.addListener(EventType.DeleteVar, deleteVarStub);

        const expr = new MathExpr();
        expr.updateExpr('10');
        cxt.addExpr(expr);

        expect(definefnStub.callCount).to.eq(0);
        expect(defineVarStub.callCount).to.eq(0);
        expect(deletefnStub.callCount).to.eq(0);
        expect(deleteVarStub.callCount).to.eq(0);

        expr.updateExpr('x = 10');

        expect(definefnStub.callCount).to.eq(0);
        expect(defineVarStub.callCount).to.eq(1);
        expect(deletefnStub.callCount).to.eq(0);
        expect(deleteVarStub.callCount).to.eq(0);

        expr.updateExpr('y = 10');

        expect(definefnStub.callCount).to.eq(0);
        expect(defineVarStub.callCount).to.eq(2);
        expect(deletefnStub.callCount).to.eq(0);
        expect(deleteVarStub.callCount).to.eq(1);

        expr.updateExpr('\\dfunc{f,x} = 10');

        expect(definefnStub.callCount).to.eq(1);
        expect(defineVarStub.callCount).to.eq(2);
        expect(deletefnStub.callCount).to.eq(0);
        expect(deleteVarStub.callCount).to.eq(2);

        expr.updateExpr('\\dfunc{g,x} = 10');

        expect(definefnStub.callCount).to.eq(2);
        expect(defineVarStub.callCount).to.eq(2);
        expect(deletefnStub.callCount).to.eq(1);
        expect(deleteVarStub.callCount).to.eq(2);

        expr.updateExpr('10');

        expect(definefnStub.callCount).to.eq(2);
        expect(defineVarStub.callCount).to.eq(2);
        expect(deletefnStub.callCount).to.eq(2);
        expect(deleteVarStub.callCount).to.eq(2);
    });

    it('emits define fn event on insert', () => {
        const cxt = new MathContext();

        const listenerStub = sinon.stub();
        cxt.bus.addListener(EventType.DefineFn, listenerStub);

        const expr = new MathExpr();
        expr.updateExpr('\\dfunc{f,x} = 10');
        cxt.addExpr(expr);

        expect(listenerStub.callCount).to.eq(1);
    });

    it('emits delete var event on expr delete', () => {
        const cxt = new MathContext();

        const deleteVarStub = sinon.stub();
        cxt.bus.addListener(EventType.DeleteVar, deleteVarStub);

        const expr = new MathExpr();
        expr.updateExpr('x = 10');
        cxt.addExpr(expr);

        expect(deleteVarStub.callCount).to.eq(0);

        cxt.removeExprById(expr.id);

        expect(deleteVarStub.callCount).to.eq(1);
    });
});
