import { expect } from 'chai';
import { MathContext, MathExpr, TrigMode } from '../../internal';

describe('evaluates expressions correctly', () => {

    it('no variables', () => {
        const tests = [
            {
                expr: '10 + 10',
                value: 20,
            },
            {
                expr: '10 - 15',
                value: -5,
            },
            {
                expr: '\\arccos{0.1}',
                value: 1.471,
            },
            {
                expr: '\\chacosh{1.1}',
                value: 0.444,
            },
            {
                expr: '\\arcsin{0.5}',
                value: 0.524,
            },
            {
                expr: '\\chasinh{0.5}',
                value: 0.4812,
            },
            {
                expr: '\\arctan{0.75}',
                value: 0.644,
            },
            {
                expr: '\\chatanh{0.75}',
                value: 0.973,
            },
            {
                expr: '\\chabs{-1.15}',
                value: 1.15,
            },
            {
                expr: '\\cos{0.7}',
                value: 0.765,
            },
            {
                expr: '\\cosh{0.7}',
                value: 1.255,
            },
            {
                expr: '100 / 10',
                value: 10
            },
            {
                expr: '\\log{0.7}',
                value: -0.155,
            },
            {
                expr: '10 * 10',
                value: 100
            },
            {
                expr: '2 * 3 + 4',
                value: 10
            },
            {
                expr: '2 * (3 + 4)',
                value: 14
            },
            {
                expr: '\\sin(40)', // radians
                value: 0.745
            },
            {
                expr: '\\ln{0.7}',
                value: -0.357,
            },
            {
                expr: '\\cos(50)', // radians
                value: 0.964
            },
            {
                expr: '\\chmax(50)',
                value: 50
            },
            {
                expr: '\\chmax{1,2}',
                value: 2
            },
            {
                expr: '\\chmin{1,2}',
                value: 1
            },
            {
                expr: '\\chmin{1}',
                value: 1
            },
            {
                expr: 'e',
                value: 2.718
            },
            {
                expr: '\\pi',
                value: 3.1415
            },
            {
                expr: '\\sqrt(3^2 + 4^2)',
                value: 5
            },
            {
                expr: '\\sqrt(3^2 + 4^2)',
                value: 5
            },
            {
                expr: '\\cos(5 * 10)',
                value: 0.964
            },
            {
                expr: '-\\cos(5 * 10)',
                value: -0.964
            },
            {
                expr: '(1/4)e^0',
                value: 0.25
            },
            {
                expr: '7+\\frac{10,2}*3',
                value: 22
            },
            {
                expr: '7+3*\\frac{10,2}',
                value: 22
            },
            {
                expr: '\\frac{(10*3),2}',
                value: 15
            },
            {
                expr: '\\frac{12,6}',
                value: 2
            },
            {
                expr: '\\frac{12,2*3}',
                value: 2
            },
            {
                expr: '\\frac{12,3+3}',
                value: 2
            },
            {
                expr: '\\sinh{0.7}',
                value: 0.759
            },
            {
                expr: '\\chsum{12}',
                value: 12
            },
            {
                expr: '\\chsum{1,2}',
                value: 3
            },
            {
                expr: '\\tan{0.7}',
                value: 0.842
            },
            {
                expr: '\\tanh{0.7}',
                value: 0.604
            },
            {
                expr: '\\exp{2}',
                value: 7.389
            },
        ];

        tests.map(test => {
            const e = new MathExpr();
            e.updateExpr(test.expr);
            expect(e.resolver.primitiveNumber, `${test.expr}`).to.be.closeTo(test.value, 0.001);
        });
    });

    it('trig mode', () => {
        const tests = [
            // cos
            {
                expr: '\\arccos{0.5}',
                value: 60,
                mode: TrigMode.Degrees,
            },
            {
                expr: '\\arccos{0.5}',
                value: 1.0472,
                mode: TrigMode.Radians,
            },
            {
                expr: '\\cos{30}',
                value: .8660,
                mode: TrigMode.Degrees,
            },
            {
                expr: '\\cos{.5}',
                value: .8776,
                mode: TrigMode.Radians,
            },
            {
                expr: '\\cosh{30}',
                value: 1.140,
                mode: TrigMode.Degrees,
            },
            {
                expr: '\\cosh{.7}',
                value: 1.2552,
                mode: TrigMode.Radians,
            },
            {
                expr: '\\chacosh{10}',
                value: 171.499,
                mode: TrigMode.Degrees,
            },
            {
                expr: '\\chacosh{10}',
                value: 2.9932,
                mode: TrigMode.Radians,
            },

            // sin
            {
                expr: '\\arcsin{.5}',
                value: 30,
                mode: TrigMode.Degrees,
            },
            {
                expr: '\\arcsin{.5}',
                value: .5235,
                mode: TrigMode.Radians,
            },
            {
                expr: '\\sin{45}',
                value: .707106,
                mode: TrigMode.Degrees,
            },
            {
                expr: '\\sin{.5}',
                value: .4794,
                mode: TrigMode.Radians,
            },
            {
                expr: '\\sinh{30}',
                value: .5478,
                mode: TrigMode.Degrees,
            },
            {
                expr: '\\sinh{.3}',
                value: .3045,
                mode: TrigMode.Radians,
            },
            {
                expr: '\\chasinh{7}',
                value: 151.4969,
                mode: TrigMode.Degrees,
            },
            {
                expr: '\\chasinh{7}',
                value: 2.644,
                mode: TrigMode.Radians,
            },

            // tan
            {
                expr: '\\arctan{.5}',
                value: 26.565,
                mode: TrigMode.Degrees,
            },
            {
                expr: '\\arctan{.5}',
                value: .4636,
                mode: TrigMode.Radians,
            },
            {
                expr: '\\tan{45}',
                value: 1,
                mode: TrigMode.Degrees,
            },
            {
                expr: '\\tan{.4}',
                value: .42279,
                mode: TrigMode.Radians,
            },
            {
                expr: '\\tanh{45}',
                value: .6555,
                mode: TrigMode.Degrees,
            },
            {
                expr: '\\tanh{.5}',
                value: .4621,
                mode: TrigMode.Radians,
            },
            {
                expr: '\\chatanh{.3}',
                value: 17.734,
                mode: TrigMode.Degrees,
            },
            {
                expr: '\\chatanh{.3}',
                value: .3095,
                mode: TrigMode.Radians,
            }
        ];

        tests.map(test => {
            const cxt = new MathContext();
            cxt.settings.setTrigMode(test.mode);
            const e = MathExpr.fromExpr(test.expr);
            cxt.addExpr(e);

            expect(cxt.settings.trigMode).to.eq(test.mode);
            expect(e.resolver.primitiveNumber, `${test.expr}`).to.be.closeTo(test.value, 0.001);
        });
    });

    describe('user defined functions', () => {

        it('one local variable', () => {
            const cxt = new MathContext();
            const f = new MathExpr();
            f.updateExpr('\\dfunc{f, x} = 2 + x');

            const expr = new MathExpr();
            expr.updateExpr('f(4)');

            cxt.addExpr(f);
            cxt.addExpr(expr);

            expect(expr.resolver.primitiveNumber).to.eq(6);
        });

        it('two local variables', () => {
            const cxt = new MathContext();
            const f = new MathExpr();
            f.updateExpr('\\dfunc{f, x, y} = x + y');

            const expr = new MathExpr();
            expr.updateExpr('f(1, 2)');

            cxt.addExpr(f);
            cxt.addExpr(expr);

            expect(expr.resolver.primitiveNumber).to.eq(3);
        });

        it('omit one variable in invocation', () => {
            const cxt = new MathContext();
            const f = new MathExpr();
            f.updateExpr('\\dfunc{f, x, y} = x + y');

            const expr = new MathExpr();
            expr.updateExpr('f(1)');

            cxt.addExpr(f);
            cxt.addExpr(expr);

            expect(expr.resolver.primitiveNumber).to.be.NaN;
            expect(expr.resolver.simplifiedDeepFormulaTree.toShorthand()).to.deep.eq({
                op: '+',
                left: '1',
                right: 'loc:y',
            });
        });

        it('two local variables, and a global', () => {
            const cxt = new MathContext();
            const f = new MathExpr();
            f.updateExpr('\\dfunc{f, x, y} = x + y + a');
            const a = new MathExpr();
            a.updateExpr('a=10');

            const expr = new MathExpr();
            expr.updateExpr('f(1, 2)');

            cxt.addExpr(a);
            cxt.addExpr(f);
            cxt.addExpr(expr);

            expect(expr.resolver.primitiveNumber).to.eq(13);
        });
    });
});
