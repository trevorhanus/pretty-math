import { expect } from 'chai';
import { autorun } from 'mobx';
import * as sinon from 'sinon';
import { MathContext, MathExpr, NodeType, SymServerSdk, TrigMode } from '../../internal';

describe('MathExpr', () => {

    describe('Creation', () => {

        it('builds an id', () => {
            const e = new MathExpr();
            expect(e.id).to.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
        });

        it('uses passed id', () => {
            const e = new MathExpr('1');
            expect(e.id).to.eq('1');
        });

        it('updateExpr', () => {
            const e = new MathExpr('1');
            e.updateExpr('a = 10');
            expect(e.expr).to.eq('a = 10');
        });

        it('define a variable', () => {
            const b = new MathExpr();
            b.updateExpr('b = 10');
            expect(b.isVariable).to.eq(true);
            expect(b.symbol).to.eq('b');
        });

        it('starts with a random color', () => {
            const e = new MathExpr();
            expect(e.color.rgbStr).to.match(/rgba\(\d+,\s\d+,\s\d+,\s\d+\)/);
        });

        it('define a variable with a subscript', async () => {
            const e = MathExpr.fromExpr('a_1 = 10 + x');
            expect(e.symbol).to.eq('a_1');
            expect(e.isVariable).to.be.true;
            expect(e.resolver.deepFormulaTree.toShorthand()).to.deep.eq({
                op: '+',
                left: '10',
                right: 'x',
            });
        });
    });

    describe('clone', () => {

        it('can clone', () => {
            const e1 = MathExpr.fromProps({
                id: '1',
                expr: 'a',
                color: '#fff',
                description: 'test',
            });

            const clone = e1.clone();

            expect(clone.id).to.not.eq(e1.id);
            expect(clone.expr).to.eq(e1.expr);
            expect(clone.color.hex).to.eq(e1.color.hex);
            expect(clone.description).to.eq(e1.description);
        });
    });

    describe('applyProps', () => {

        it('can apply same expr', () => {
            const cxt = new MathContext();
            const e = cxt.createExpr({
                id: '1',
                expr: 'a = 10',
                color: 'rgba(1, 2, 3, 0.5)'
            });

            cxt.addExpr(e);

            e.applyProps({
                expr: 'a = 10'
            });

            expect(e.hasError).to.be.false;
        });

        it('units prop', () => {
            const e = new MathExpr();

            let units: string;
            autorun(() => {
                units = e.units;
            });

            expect(units).to.eq(undefined);

            e.applyProps({ units: 'foo' });
            expect(units).to.eq('foo');

            e.applyProps({ expr: 'a', units: undefined });
            expect(units).to.eq('foo');

            e.applyProps({ units: null });
            expect(units).to.eq(null);
        });
    });

    describe('Value', () => {

        it('expression only (no variables)', () => {
            const tests = [
                {
                    expr: '10 + 10',
                    value: 20
                },
                {
                    expr: '10 - 10',
                    value: 0
                },
                {
                    expr: '100 / 10',
                    value: 10
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
                    expr: '\\cos(50)', // radians
                    value: 0.964
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
                    expr: '\\chsum(1, 2)',
                    value: 3
                },
                {
                    expr: '\\chsum(1, 2, 2+1)',
                    value: 6
                },
                {
                    expr: '\\chmin(1, 2, 2+1)',
                    value: 1
                },
                {
                    expr: '\\chmax(1, 2, 2+1)',
                    value: 3
                },
            ];

            tests.map(test => {
                const e = new MathExpr();
                e.setContext(mockContext);
                e.updateExpr(test.expr);
                expect(e.primitiveNumber, `${test.expr}`).to.be.closeTo(test.value, 0.001);
            });
        });

        it('multiple expressions', () => {
            const tests = [
                {
                    expr1: 'a = 10',
                    expr2: 'a + 10',
                    value: 20
                },
                {
                    expr1: 'foo = 10',
                    expr2: 'foo^2',
                    value: 100
                },
                {
                    expr1: '\\theta = 50',
                    expr2: '\\cos{\\theta}',
                    value: 0.964
                },
                {
                    expr1: 'a = 3',
                    expr2: '2a^2',
                    value: 18
                },
            ];

            tests.map(test => {
                const cxt = new MathContext();
                const e1 = cxt.createExpr(test.expr1);
                const e2 = cxt.createExpr(test.expr2);
                cxt.addExpr(e1);
                cxt.addExpr(e2);
                expect(e2.primitiveNumber, `${test.expr1}`).to.be.closeTo(test.value, 0.001);
            });
        });
    });

    describe('MathExpr#description', () => {

        it('initializes with out description', () => {
            const e = MathExpr.fromProps({});
            expect(e.description).to.eq(undefined);
        });

        it('can set description', () => {
            const e = MathExpr.fromProps({});

            e.applyProps({
                description: 'test',
            });

            expect(e.description).to.eq('test');
        });

        it('is observable', () => {
            const e = MathExpr.fromProps({});

            let v = '';
            autorun(() => {
                v = e.description;
            });

            expect(v).to.eq(undefined);

            e.applyProps({
                description: 'test',
            });

            expect(v === 'test');

            e.applyProps({
                description: '',
            });

            expect(v).to.eq('');
        });
    });

    describe('MathExpr#toJS', () => {

        it('all props', () => {

            const v = MathExpr.fromProps({
                id: '1',
                expr: 'a = 10',
                color: 'rgba(1, 2, 3, 0.5)',
                description: 'foo',
                units: 'm',
            });

            expect(v.toJS()).to.deep.eq({
                id: '1',
                color: 'rgba(1, 2, 3, 0.5)',
                description: 'foo',
                expr: 'a = 10',
                units: 'm',
            });
        });

        it('no description or units', () => {

            const v = MathExpr.fromProps({
                id: '1',
                expr: 'a = 10',
                color: 'rgba(1, 2, 3, 0.5)',
            });

            expect(v.toJS()).to.deep.eq({
                id: '1',
                color: 'rgba(1, 2, 3, 0.5)',
                expr: 'a = 10',
            });
        });
    });

    describe('Errors', () => {

        it('invalid char', () => {
            const b = new MathExpr();
            b.updateExpr('@');
            expect(b.hasError).to.eq(true);
            expect(b.expr).to.eq('@');
            expect(b.isVariable).to.eq(false);
            expect(b.symbol).to.be.null;
        });

        it('invalid math syntax', () => {
            const b = new MathExpr();
            b.updateExpr('a := ( 5 +10 ');
            expect(b.hasError).to.eq(true);
        });
    });

    describe('User Defined Functions', () => {

        it('define a function', () => {
            const f = new MathExpr();

            const expr = '\\dfunc{f, x} = x + 10';
            f.updateExpr(expr);

            expect(f.error, 'error').to.eq(null);
            expect(f.errorMessage, 'errorMessage').to.eq('');
            expect(f.expr, 'expr').to.eq(expr);
            expect(f.formulaRoot.tokenValue, 'formulaRoot.value').to.eq('+');
            expect(f.funcName, 'funcName').to.eq('f');
            expect(f.funcDefinitionLocalSymbolNames, 'funcLocalVars').to.deep.eq(['x']);
            expect(f.hasError, 'hasError').to.be.false;
            expect(f.isEmpty, 'isEmpty').to.be.false;
            expect(f.isFunctionDefinition, 'isFunctionDefinition').to.be.true;
            expect(f.isVariable, 'isVariable').to.be.false;
            expect(f.shallowTree.tokenValue, 'root.value').to.eq('=');
            expect(f.symbol, 'symbol').to.be.null;
            expect(f.uniqueNonLocalSymbolNodes.length, 'uniqueNonLocalSymbolNodes.length').to.eq(0);
        });

        it('define a function with a global variable', () => {
            const f = new MathExpr();

            const expr = '\\dfunc{f, x} = x + 10 * a';
            f.updateExpr(expr);

            expect(f.error, 'error').to.eq(null);
            expect(f.expr, 'expr').to.eq(expr);
            expect(f.errorMessage, 'errorMessage').to.eq('');
            expect(f.formulaRoot.tokenValue, 'formulaRoot.value').to.eq('+');
            expect(f.funcName, 'funcName').to.eq('f');
            expect(f.funcDefinitionLocalSymbolNames, 'funcLocalVars').to.deep.eq(['x']);
            expect(f.hasError, 'hasError').to.be.false;
            expect(f.isEmpty, 'isEmpty').to.be.false;
            expect(f.isFunctionDefinition, 'isFunctionDefinition').to.be.true;
            expect(f.isVariable, 'isVariable').to.be.false;
            expect(f.shallowTree.tokenValue, 'root.value').to.eq('=');
            expect(f.symbol, 'symbol').to.be.null;
            expect(f.uniqueNonLocalSymbolNodes.length, 'uniqueNonLocalSymbolNodes.length').to.eq(1);
        });

        it('define a function with two locals and a subscript', () => {
            const f = new MathExpr();

            const expr = '\\dfunc{g_i, x_n, y} = x_n + 10 * y';
            f.updateExpr(expr);

            expect(f.error, 'error').to.eq(null);
            expect(f.expr, 'expr').to.eq(expr);
            expect(f.errorMessage, 'errorMessage').to.eq('');
            expect(f.formulaRoot.tokenValue, 'formulaRoot.value').to.eq('+');
            expect(f.funcName, 'funcName').to.eq('g_i');
            expect(f.funcDefinitionLocalSymbolNames, 'funcLocalVars').to.deep.eq(['x_n', 'y']);
            expect(f.hasError, 'hasError').to.be.false;
            expect(f.isEmpty, 'isEmpty').to.be.false;
            expect(f.isFunctionDefinition, 'isFunctionDefinition').to.be.true;
            expect(f.isVariable, 'isVariable').to.be.false;
            expect(f.shallowTree.tokenValue, 'root.value').to.eq('=');
            expect(f.symbol, 'symbol').to.be.null;
            expect(f.uniqueNonLocalSymbolNodes.length, 'uniqueNonLocalSymbolNodes.length').to.eq(0);
        });

        xit('define a function: missing param', () => {
            const f = new MathExpr();

            const expr = '\\dfunc{g,} = x + 10';
            f.updateExpr(expr);

            expect(f.error, 'error').to.not.eq(null);
            expect(f.expr, 'expr').to.eq(expr);
            expect(f.errorMessage, 'errorMessage').to.eq(`Missing operand for ','.`);
            expect(f.formulaRoot.tokenValue, 'formulaRoot').to.eq('+');
            expect(f.funcName, 'funcName').to.eq('g');
            expect(f.fnParamNodes.length, 'fnParamNodes').to.eq(1);
            expect(f.funcDefinitionLocalSymbolNames, 'funcLocalVars').to.deep.eq([]);
            expect(f.hasError, 'hasError').to.be.true;
            expect(f.isEmpty, 'isEmpty').to.be.false;
            expect(f.isFunctionDefinition, 'isFunctionDefinition').to.be.true;
            expect(f.isVariable, 'isVariable').to.be.false;
            expect(f.shallowTree.tokenValue, 'root.tokenValue').to.eq('=');
            expect(f.symbol, 'symbol').to.be.null;
            expect(f.uniqueNonLocalSymbolNodes.length, 'uniqueNonLocalSymbolNodes.length').to.eq(1);
        });

        it('invoke a function', () => {
            const cxt = new MathContext();
            const f = new MathExpr();
            f.updateExpr('\\dfunc{f, x} = x + 2');
            const evaluateF = new MathExpr();
            evaluateF.updateExpr('f(4)');

            cxt.addExpr(f);
            cxt.addExpr(evaluateF);

            expect(evaluateF.error, 'error').to.eq(null);
            expect(evaluateF.expr, 'expr').to.eq('f(4)');
            expect(evaluateF.errorMessage, 'errorMessage').to.eq('');
            expect(evaluateF.formulaRoot, 'formulaRoot').to.be.null;
            expect(evaluateF.funcName, 'funcName').to.be.null;
            expect(evaluateF.funcDefinitionLocalSymbolNames, 'funcLocalVars').to.deep.eq([]);
            expect(evaluateF.hasError, 'hasError').to.be.false;
            expect(evaluateF.isEmpty, 'isEmpty').to.be.false;
            expect(evaluateF.isFunctionDefinition, 'isFunctionDefinition').to.be.false;
            expect(evaluateF.isVariable, 'isVariable').to.be.false;
            expect(evaluateF.shallowTree.type, 'root.type').to.eq(NodeType.Operator);
            expect(evaluateF.symbol, 'symbol').to.be.null;
            expect(evaluateF.uniqueNonLocalSymbolNodes.length, 'uniqueNonLocalSymbolNodes.length').to.eq(0);
        });
    });

    describe('define command', () => {

        let doDerivativeStub;

        before(() => {
            doDerivativeStub = sinon.stub(SymServerSdk, 'doDerivative');
        });

        after(() => {
            doDerivativeStub.restore();
        });

        it('define a variable to a literal', () => {
            const cxt = new MathContext();
            const x = MathExpr.fromExpr('x = 10');
            cxt.addExpr(x);

            expect(x.isVariable).to.be.true;
            expect(x.resolver.shallowTree.toCalchub().expr).to.eq('x=10');
            expect(x.resolver.primitiveNumber).to.eq(10);
        });

        it('define a variable to a numeric expression', () => {
            const cxt = new MathContext();
            const x = MathExpr.fromExpr('x = 10 + 2');
            cxt.addExpr(x);

            expect(x.isVariable).to.be.true;
            expect(x.resolver.primitiveNumber).to.eq(12);
        });

        it('define a function that equals a derivative', (done) => {
            doDerivativeStub.callsFake((req, cb) => {
                setTimeout(() => {
                    cb(null, { resultAsPython: '2 x' });
                }, 10);
            });

            const cxt = new MathContext();
            const f = new MathExpr();
            f.updateExpr('\\dfunc{f, x} = \\diff{x^2,\\wrt{x}}');
            cxt.addExpr(f);

            f.resolver.resolveDeepTree(() => {
                try {
                    expect(f.resolver.deepTree.toCalchub().expr).to.eq('\\dfunc{f,x}=2 x');
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('define a function as a derivative, then invoke the function', (done) => {
            doDerivativeStub.callsFake((req, cb) => {
                setTimeout(() => {
                    cb(null, { resultAsPython: '2 x' });
                }, 10);
            });

            const cxt = new MathContext();
            const f = MathExpr.fromExpr('\\dfunc{f, x} = \\diff{x^2,\\wrt{x}}');
            cxt.addExpr(f);

            const invokeF = MathExpr.fromExpr('f(2)');
            cxt.addExpr(invokeF);

            invokeF.resolver.resolveDeepTree((err, tree) => {
                expect(invokeF.resolver.primitiveNumber).to.eq(4);
                done();
            });
        });

        it('define function eval', () => {
            const cxt = new MathContext();
            const y = MathExpr.fromExpr('y=10');
            const f = MathExpr.fromExpr('\\dfunc{f,x} = x + 2 + y');

            cxt.addExpr(y);
            cxt.addExpr(f);

            expect(f.resolver.deepTree.toShorthand()).to.deep.eq({
                op: '=',
                left: {
                    op: '\\dfunc',
                    left: {
                        op: ',',
                        left: 'f',
                        right: 'loc:x',
                    }
                },
                right: {
                    op: '+',
                    left: {
                        op: '+',
                        left: 'loc:x',
                        right: '2'
                    },
                    right: '10'
                }
            });
        });
    });
});

/////////////////////////

const mockContext: any = {
    exprs: [] as MathExpr[],
    vars: [] as MathExpr[],
    hasVar: sinon.stub(),
    getVar: sinon.stub(),
    expr: sinon.stub(),
    removeExpr: sinon.stub(),
    settings: {
        trigMode: TrigMode.Radians,
    },
    __$$setVar: sinon.stub(),
    __$$removeVar: sinon.stub(),
};
