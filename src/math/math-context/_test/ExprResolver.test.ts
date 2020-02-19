import { expect } from 'chai';
import * as sinon from 'sinon';
import { MathContext, MathExpr, SymServerSdk } from '../../internal';

describe('ExprResolver', () => {

    it('no dependencies', () => {
        const cxt = new MathContext();
        const expr = MathExpr.fromExpr('10+5*3');
        cxt.addExpr(expr);
        expect(expr.resolver.primitiveNumber).to.eq(25);
    });

    it('with a function', () => {
        const cxt = new MathContext();
        const expr = MathExpr.fromExpr('\\sqrt{4}');

        cxt.addExpr(expr);

        expect(expr.resolver.primitiveNumber).to.eq(2);
    });

    it('simple dependency', () => {
        const cxt = new MathContext();
        const a = MathExpr.fromExpr('a=10');
        cxt.addExpr(a);
        const b = MathExpr.fromExpr('b=a+10');
        cxt.addExpr(b);
        
        expect(b.resolver.primitiveNumber).to.eq(20);
    });

    it('multi-level dependencies', () => {
        const cxt = new MathContext();
        const a = MathExpr.fromExpr('a=10');
        cxt.addExpr(a);
        const b = MathExpr.fromExpr('b=a+10');
        cxt.addExpr(b);
        const c = MathExpr.fromExpr('c=b+10');
        cxt.addExpr(c);

        expect(c.resolver.primitiveNumber).to.eq(30);
    });

    it('observes local symbols', () => {
        const cxt = new MathContext();
        const a = MathExpr.fromExpr('a=10');
        cxt.addExpr(a);
        const f = MathExpr.fromExpr('\\dfunc{f,a}=a+10');
        cxt.addExpr(f);

        const expected = {
            op: '+',
            left: 'loc:a',
            right: '10',
        };

        expect(f.resolver.deepFormulaTree.toShorthand()).to.deep.eq(expected);
    });

    it('invoke user defined function', () => {
        const cxt = new MathContext();
        const f = MathExpr.fromExpr('\\dfunc{f,x} = x^{2}');
        cxt.addExpr(f);
        const b = MathExpr.fromExpr('b=f(2)');
        cxt.addExpr(b);
        expect(b.primitiveNumber).to.eq(4);
    });

    describe('async nodes', () => {
        let doDerivativeStub;

        beforeEach(() => {
            doDerivativeStub = sinon.stub(SymServerSdk, 'doDerivative');
        });

        afterEach(() => {
            doDerivativeStub.restore();
        });

        it('dependency with derivative', (done) => {
            doDerivativeStub.callsFake((req, cb) => {
                setTimeout(() => {
                    cb(null, { resultAsPython: '2' });
                }, 10);
            });

            const cxt = new MathContext();
            const a = MathExpr.fromExpr('a=\\diff{2*x,\\wrt{x}}');
            expect(a.resolver.isResolving).to.eq(true); // will take 10ms to resolve

            cxt.addExpr(a);

            const b = MathExpr.fromExpr('b=4*a');
            expect(b.resolver.isResolving).to.eq(false); // should resolve immediately, since no MathContext

            cxt.addExpr(b);
            expect(b.resolver.isResolving).to.eq(true); // now b will be waiting for a to resolve
            expect(b.primitiveNumber).to.be.NaN;

            b.resolver.resolveDeepTree(() => {
                expect(b.resolver.primitiveNumber).to.eq(8);
                done();
            });
        });

        it('derivative that resolves with a variable defined in the context', (done) => {
            doDerivativeStub.callsFake((req, cb) => {
                setTimeout(() => {
                    cb(null, { resultAsPython: '2 x' });
                }, 10);
            });

            const cxt = new MathContext();
            const x = MathExpr.fromExpr('x=20');

            cxt.addExpr(x);

            const f = MathExpr.fromExpr('y=\\diff{x^{2},\\wrt{x}}');

            cxt.addExpr(f);

            f.resolver.resolveDeepTree((err, tree) => {
                try {
                    expect(f.primitiveNumber).to.eq(40);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });
    });
});
