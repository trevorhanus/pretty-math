import { assert, expect } from 'chai';
import * as sinon from 'sinon';
import { DataTable, MathContext, MathExpr, UC, SymServerSdk } from '../../internal';
import { pythagoreanProps } from './fixtures/Pythagorean';

describe('MathContext', () => {

    it('can add an expr', () => {
        const cxt = new MathContext();
        const a = cxt.createExpr('10 + \\sqrt{4}');
        cxt.addExpr(a);
        expect(cxt.exprs.length).to.eq(1);
    });

    it('can add an expr instance', () => {
        const cxt = new MathContext();
        const ex = new MathExpr();
        cxt.addExpr(ex);
        expect(cxt.exprs.length).to.eq(1);
    });

    it('can remove expr', () => {
        const cxt = new MathContext();
        const a = cxt.createExpr('10 + \\sqrt{4}');
        cxt.addExpr(a);
        expect(cxt.exprs.length).to.eq(1);
        cxt.removeExprById(a.id);
        expect(cxt.exprs.length).to.eq(0);
    });

    it('removes expr and var', () => {
        const cxt = new MathContext();
        const a = cxt.createExpr('a = 10');
        cxt.addExpr(a);
        expect(cxt.exprs.length).to.eq(1);
        expect(cxt.vars.length).to.eq(1);
        cxt.removeExprById(a.id);
        expect(cxt.exprs.length).to.eq(0);
        expect(cxt.vars.length).to.eq(0);
    });

    it('can add a definition', () => {
        const cxt = new MathContext();
        const a = cxt.createExpr('a = 10');
        cxt.addExpr(a);
        expect(cxt.exprs.length).to.eq(1);
        expect(cxt.vars.length).to.eq(1);
    });

    it('can update a definition to be an expr', () => {
        const cxt = new MathContext();
        const a = cxt.createExpr('a = 10');
        cxt.addExpr(a);
        expect(cxt.exprs.length).to.eq(1);
        expect(cxt.vars.length).to.eq(1);
        a.updateExpr('10');
        expect(cxt.exprs.length).to.eq(1);
        expect(cxt.vars.length).to.eq(0);
    });

    it('update var to diff symbol', () => {
        const cxt = new MathContext();
        const a = cxt.createExpr('a = 10');
        cxt.addExpr(a);
        expect(cxt.exprs.length).to.eq(1);
        expect(cxt.vars.length).to.eq(1);
        a.updateExpr('b = 20');
        expect(cxt.exprs.length).to.eq(1);
        expect(cxt.vars.length).to.eq(1);
        assert(cxt.getVar('a') == null);
        expect(a.symbol).to.eq('b');
        assert(a.isVariable);
        expect(cxt.getVar('b')).to.eq(a);
    });

    it('build from js', () => {
        const cxt1 = MathContext.fromJS(pythagoreanProps);
        expect(cxt1.exprs.length).to.eq(3);
    });

    describe('merge', () => {

        it('no conflicts', () => {
            const cxt1 = MathContext.fromJS(pythagoreanProps);
            const cxt2 = MathContext.fromJS({
                exprs: [
                    { id: '1', expr: 'd = 10' }
                ]
            });
            cxt1.merge(cxt2);
            expect(cxt1.getVar('d')).to.be.ok;
        });

        it('throws on conflicts', () => {
            const cxt1 = MathContext.fromJS(pythagoreanProps);
            const cxt2 = MathContext.fromJS({
                exprs: [
                    {
                        id: '1',
                        expr: 'a = 10'
                    }
                ]
            });
            expect(() => {
                cxt1.merge(cxt2);
            }).to.throw();
        });
    });

    describe('Colors', () => {

        it('adds a color to new expr that is a variable', () => {
            const cxt = new MathContext();
            const a = cxt.createExpr('a := x');
            expect(a.color).to.not.equal(null);
        });

        it('sets passed color when building from js', () => {
            const cxt = new MathContext();
            const v = cxt.createExpr({
                id: '1',
                expr: 'a := 10',
                color: '#AAAAAA',
            });
            expect(v.color.rgbStr).to.eq('rgba(170, 170, 170, 1)');
        });

        it('sets random color when building from js and color is blank', () => {
            const cxt = new MathContext();
            const v = cxt.createExpr({
                id: '1',
                expr: 'a := 10',
            });
            expect(v.color.rgbStr).to.not.eq(null);
        });
    });

    describe('Reactions', () => {

        it('add symbolic then define var', () => {
            const cxt = new MathContext();
            const a = cxt.createExpr('a = x');
            cxt.addExpr(a);

            expect(a.resolver.deepFormulaTree.toShorthand()).to.deep.eq('x');

            const x = cxt.createExpr('x = 10');
            cxt.addExpr(x);

            expect(a.resolver.deepTree.toShorthand()).to.deep.eq({
                op: '=',
                left: 'a',
                right: '10',
            });
        });
    });

    describe('Duplicate vars', () => {

        it('sets error message when attempting to add a duplicate var', () => {
            const cxt = new MathContext();
            const a = cxt.createExpr('a = x');
            cxt.addExpr(a);
            const a2 = cxt.createExpr('a = 10');
            cxt.addExpr(a2);
            expect(a2.hasError).to.be.true;
        });

        it('sets error message when updating expr with var def that exists', () => {
            const cxt = new MathContext();
            const a = cxt.createExpr('a = x');
            const b = cxt.createExpr('b = 10');
            cxt.addExpr(a);
            cxt.addExpr(b);
            expect(b.hasError).to.eq(false);

            b.updateExpr('a = 10');
            expect(b.hasError).to.be.true;
            expect(b.errorMessage).to.eq(`Variable 'a' already exists.`);
        });

        it('can add a duplicate var and delete it', () => {
            const cxt = new MathContext();
            const a = cxt.createExpr('a = 20');
            const a1 = cxt.createExpr('a = 10');
            cxt.addExpr(a);
            cxt.addExpr(a1);

            expect(a.hasError).to.be.true;
            expect(a1.hasError).to.be.true;

            cxt.removeExprById(a1.id);

            expect(a.hasError).to.be.false;
        });

        it('can create a duplicate var by updating and delete it', () => {
            const cxt = new MathContext();
            const a = cxt.createExpr('a = 20');
            const a1 = cxt.createExpr('');
            cxt.addExpr(a);
            cxt.addExpr(a1);

            expect(a.hasError).to.be.false;
            expect(a1.hasError).to.be.false;

            a1.applyProps({
                expr: 'a = 10',
            });

            expect(a.hasError).to.be.true;
            expect(a1.hasError).to.be.true;

            cxt.removeExprById(a1.id);

            expect(a.hasError).to.be.false;
        });

        it('insert dup vars then delete the first', () => {
            const cxt = new MathContext();
            const a1 = cxt.createExpr('a = 10');
            const a2 = cxt.createExpr('a = 11');
            cxt.addExpr(a1);
            cxt.addExpr(a2);
            assert(a2.hasError);
            cxt.removeExprById(a1.id);
            assert(!a2.hasError);
        });
    });

    describe('Add and remove expressions', () => {

        it('can add and remove blank expression', () => {
            const cxt = new MathContext();
            const e1 = new MathExpr();
            cxt.addExpr(e1);

            const added = cxt.exprs[0];
            expect(added).to.eq(e1);
            expect(added.mathCxt).to.eq(cxt);

            cxt.removeExprById(e1.id);
            expect(e1.mathCxt).to.eq(null);
            expect(cxt.exprs.length).to.eq(0);
        });

        it('can add and remove independent expression', () => {
            const cxt = new MathContext();
            const e1 = new MathExpr();
            e1.updateExpr('a = 10');
            cxt.addExpr(e1);

            const added = cxt.exprs[0];
            expect(added).to.eq(e1);
            expect(added.mathCxt).to.eq(cxt);
            expect(cxt.vars.length).to.eq(1);

            cxt.removeExprById(e1.id);
            expect(e1.mathCxt).to.eq(null);
            expect(cxt.exprs.length).to.eq(0);
            expect(cxt.vars.length).to.eq(0);

            expect(e1.isVariable).to.eq(true);
        });

        it('can add and remove dependent expression', () => {
            const cxt = new MathContext();
            const a = new MathExpr();
            a.updateExpr('a = 10');
            const b = new MathExpr();
            b.updateExpr('b = a + 10');

            cxt.addExpr(a);
            cxt.addExpr(b);

            expect(cxt.exprs.length).to.eq(2);
            expect(b.resolver.primitiveNumber).to.eq(20);

            cxt.removeExprById(a.id);

            expect(cxt.exprs.length).to.eq(1);
            expect(b.resolver.deepFormulaTree.toShorthand()).to.deep.eq({
                op: '+',
                left: 'a',
                right: '10',
            });
        });

        it('does not duplicate when same expression is added twice', () => {
            const cxt = new MathContext();
            const a = cxt.createExpr('a = 10');

            cxt.addExpr(a);

            expect(cxt.exprs.length).to.eq(1);

            cxt.addExpr(a);

            expect(cxt.exprs.length).to.eq(1);
        });
    });

    xdescribe('data tables', () => {

        it('auto-generates a name', () => {
            const cxt = new MathContext();
            const t1 = new DataTable();
            cxt.addDataTable(t1);

            expect(t1.tableName).to.eq('Table1');
        });

        it('does not add a table with name that already exists', () => {
            const cxt = new MathContext();
            const t1 = new DataTable();
            cxt.addDataTable(t1);

            const t2 = new DataTable('Table1');
            cxt.addDataTable(t2);

            expect(cxt.dataTables.length).to.eq(1);
        });

        it('can add a table', () => {
            const cxt = new MathContext();
            const t1 = new DataTable('Table1');
            t1.setCell('A1', '10');
            cxt.addDataTable(t1);

            expect(cxt.dataTables.length).to.eq(1);
            expect(cxt.getTableCell('Table1!A1').expr).to.eq('10');
            expect(cxt.getTableCell('Table1!A2')).to.be.undefined;
        });

        it('can remove a table', () => {
            const cxt = new MathContext();
            const t1 = new DataTable();
            cxt.addDataTable(t1);
            expect(cxt.dataTables.length).to.eq(1);
            cxt.removeDataTableByTableName(t1.tableName);
            expect(cxt.dataTables.length).to.eq(0);
        });

        it('can add an expression that references a value in a table', () => {
            const cxt = new MathContext();
            const t1 = new DataTable('Table1');
            t1.setCell('A1', '10');
            cxt.addDataTable(t1);

            const e = new MathExpr();
            e.updateExpr('a = Table1!A1 * 2');
            cxt.addExpr(e);

            expect(e.resolver.primitiveNumber).to.eq(20);
        });

        it('sum a range', () => {
            const cxt = new MathContext();
            const t1 = new DataTable('Table1');
            t1.setCell('A1', '1');
            t1.setCell('A2', '2');
            t1.setCell('A3', '3');
            t1.setCell('A4', '=\\chsum(A1:A3)');
            cxt.addDataTable(t1);

            // expect(cxt.getTableCell('Table1!A4').eval().value.primitiveNumber).to.eq(6);
        });

        it('sum a range from a math expr', async () => {
            const cxt = new MathContext();
            const t1 = new DataTable('Table1');
            t1.setCell('A1', '1');
            t1.setCell('A2', '2');
            t1.setCell('A3', '3');
            cxt.addDataTable(t1);

            const e1 = new MathExpr();
            e1.applyProps({
                expr: '\\chsum(Table1!A1:A3)',
            });

            cxt.addExpr(e1);

            expect(e1.resolver.primitiveNumber).to.eq(6);
        });

        it('sum ignores values that are strings', () => {
            const cxt = new MathContext();
            const t1 = new DataTable('Table1');
            t1.setCell('A1', 'foo');
            t1.setCell('A2', '1');
            t1.setCell('A3', '2');
            cxt.addDataTable(t1);

            t1.setCell('A4', '=\\chsum(A1:A3)');

            expect(t1.getCell('A4').primitiveNumber).to.eq(3);
        });
    });

    describe('subscripts in context', () => {

        it('define subscripts', async () => {
            const cxt = new MathContext();
            const a_1 = new MathExpr();
            a_1.updateExpr('a_1 = 10');

            const b = new MathExpr();
            b.updateExpr('b = a_1 + 2');

            cxt.addExpr(a_1);
            cxt.addExpr(b);

            expect(a_1.isVariable).to.be.true;
            expect(b.resolver.primitiveNumber).to.eq(12);
            expect(a_1.resolver.primitiveNumber).to.eq(10);
        });
    });

    describe('user defined functions', () => {

        it('can add one', () => {
            const cxt = new MathContext();
            const f = new MathExpr();
            f.updateExpr('\\dfunc{f, x} = 2');

            cxt.addExpr(f);

            expect(cxt.getFunc('f')).to.eq(f);
            expect(cxt.funcs).to.deep.eq([f]);
            expect(cxt.hasFunc('f')).to.be.true;
        });

        it('duplicate error', () => {
            const cxt = new MathContext();
            const f = new MathExpr();
            f.updateExpr('\\dfunc{f, x} = 2');
            const f2 = new MathExpr();
            f2.updateExpr('\\dfunc{f, y} = 3');

            cxt.addExpr(f);
            cxt.addExpr(f2);

            expect(cxt.getFunc('f')).to.eq(f);
            expect(cxt.funcs).to.deep.eq([f, f2]);

            expect(f.hasError, 'f has error').to.be.true;
            expect(f2.hasError, 'f2 has error').to.be.true;
        });

        it('duplicate error: variable and function with same name', () => {
            const cxt = new MathContext();
            const fFunc = new MathExpr();
            fFunc.updateExpr('\\dfunc{f, x} = 2');
            const fVar = new MathExpr();
            fVar.updateExpr('f = 10');

            cxt.addExpr(fFunc);
            cxt.addExpr(fVar);

            expect(fFunc.hasError, 'fFunc has error').to.be.true;
            expect(fVar.hasError, 'fVar has error').to.be.true;
        });

        it('duplicate error: 2 funcs and a variable', () => {
            const cxt = new MathContext();
            const fFunc = new MathExpr();
            fFunc.updateExpr('\\dfunc{f, x} = 2');
            const gFunc = new MathExpr();
            gFunc.updateExpr('\\dfunc{f, y} = 2');
            const fVar = new MathExpr();
            fVar.updateExpr('f = 10');

            cxt.addExpr(fFunc);
            cxt.addExpr(gFunc);
            cxt.addExpr(fVar);

            expect(fFunc.hasError, 'fFunc has error').to.be.true;
            expect(gFunc.hasError, 'gFunc has error').to.be.true;
            expect(fVar.hasError, 'fVar has error').to.be.true;
        });

        it('can invoke a function', () => {
            const cxt = new MathContext();
            const f = new MathExpr();
            f.updateExpr('\\dfunc{f, x} = 2 + x');
            const invoker = new MathExpr();
            invoker.updateExpr('f(2)');

            cxt.addExpr(f);
            cxt.addExpr(invoker);

            expect(invoker.resolver.primitiveNumber).to.eq(4);
        });

        it('Two funcs with same local variables and a global variable', () => {
            const cxt = new MathContext();

            const x = new MathExpr();
            x.updateExpr('x=10');

            const f = new MathExpr();
            f.updateExpr('\\dfunc{f, x} = 2 + x');

            const g = new MathExpr();
            g.updateExpr('\\dfunc{g, x} = 3 + x');

            const fInvoker = new MathExpr();
            fInvoker.updateExpr('f(2)');

            const gInvoker = new MathExpr();
            gInvoker.updateExpr('g(3)');

            cxt.addExpr(x);
            cxt.addExpr(f);
            cxt.addExpr(g);
            cxt.addExpr(fInvoker);
            cxt.addExpr(gInvoker);

            expect(x.resolver.primitiveNumber).to.eq(10);
            expect(fInvoker.resolver.primitiveNumber).to.eq(4);
            expect(gInvoker.resolver.primitiveNumber).to.eq(6);
        });
    });

    describe('local variables',  () => {

        let doDerivativeStub;

        beforeEach(() => {
            doDerivativeStub = sinon.stub(SymServerSdk, 'doDerivative');
            doDerivativeStub.resolves({ resultAsPython: '' });
        });

        afterEach(() => {
            doDerivativeStub.restore();
        });

        it('Derivative with differential defined variable', (done) => {
            doDerivativeStub.callsFake((req, cb) => {
                setTimeout(() => {
                    cb(null, { resultAsPython: '2 x' });
                }, 10);
            });

            // spy(event => {
            //     console.log(event.type);
            // });

            const cxt = new MathContext();

            const x = new MathExpr();
            x.updateExpr('x=20');

            const f = new MathExpr();
            f.updateExpr('y=\\diff{x^{2},\\wrt{x}}');

            cxt.addExpr(x);
            cxt.addExpr(f);

            f.resolver.resolveDeepTree((err, tree) => {
                expect(f.resolver.primitiveNumber).to.eq(40);
                done();
            });
        });

        it('user defined function with async node in expr', (done) => {
            doDerivativeStub.callsFake((req, cb) => {
                setTimeout(() => {
                    cb(null, { resultAsPython: '2 x' });
                }, 10);
            });

            const cxt = new MathContext();

            const x = new MathExpr();
            x.updateExpr('x=20');

            const f = new MathExpr();
            f.updateExpr('\\dfunc{f,x}=\\diff{x^{2},\\wrt{x}}');

            cxt.addExpr(x);
            cxt.addExpr(f);

            const expected = {
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
                    op: UC.ImplicitM,
                    left: '2',
                    right: 'loc:x',
                }
            };

            f.resolver.resolveDeepTree(() => {
                try {
                    expect(f.resolver.deepTree.toShorthand()).to.deep.eq(expected);
                    done();
                } catch (e){
                    done(e);
                }
            });
        });

        xit('Derivative with differential that is a defined function', (done) => {
            doDerivativeStub.callsFake((req, cb) => {
                setTimeout(() => {
                    cb(null, { resultAsPython: '3f^{2}' });
                }, 10);
            });

            const cxt = new MathContext();

            const f = new MathExpr();
            f.updateExpr('\\dfunc{f,x}=x+8');

            const deriv = new MathExpr();
            deriv.updateExpr('y=\\diff{f^{3},\\wrt{f}}');

            cxt.addExpr(f);
            cxt.addExpr(deriv);

            const expected = {
                val: '\\diff',
                left: {
                    val: ',',
                    left: {
                        val: '\\wrt',
                        left: {
                            val: 'f'
                        }
                    },
                    right: {
                        val: '^',
                        left: {
                            val: 'f'
                        },
                        right: {
                            val: '3'
                        }
                    }
                }
            };

            deriv.resolver.resolveDeepTree(() => {
                expect(deriv.resolver.deepTree.toShorthand()).to.deep.eq(expected);
                done();
            });
        });

        it('Derivative inside a derivative', (done) => {
            // first two calls: reaction to updateExpr
            doDerivativeStub.onCall(0).callsFake((req, cb) => cb(null, { resultAsPython: '2 y x' }));
            doDerivativeStub.onCall(1).callsFake((req, cb) => cb(null, { resultAsPython: '2 y' }));
            // second two calls: reaction to cxt.addExpr
            doDerivativeStub.onCall(2).callsFake((req, cb) => cb(null, { resultAsPython: '2 y x' }));
            doDerivativeStub.onCall(3).callsFake((req, cb) => cb(null, { resultAsPython: '2 y' }));

            const cxt = new MathContext();

            const z = new MathExpr();
            z.updateExpr('z=\\diff{\\diff{x y^{2},\\wrt{y}},\\wrt{x}}');
            cxt.addExpr(z);

            z.resolver.resolveDeepTree(() => {
                try {
                    expect(z.resolver.deepFormulaTree.toShorthand()).to.deep.eq({
                        op: UC.ImplicitM,
                        left: '2',
                        right: 'y',
                    });

                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('Derivative inside a derivative with user defined function', (done) => {
            doDerivativeStub.onCall(0).callsFake((req, cb) => cb(null, { resultAsPython: '2 y x' }));
            doDerivativeStub.onCall(1).callsFake((req, cb) => cb(null, { resultAsPython: '2 y' }));
            doDerivativeStub.onCall(2).callsFake((req, cb) => cb(null, { resultAsPython: '2 y x' }));
            doDerivativeStub.onCall(3).callsFake((req, cb) => cb(null, { resultAsPython: '2 y' }));

            const cxt = new MathContext();

            const y = MathExpr.fromExpr('\\dfunc{y,x}=x^{2}');
            cxt.addExpr(y);

            const z = new MathExpr();
            z.updateExpr('z=\\diff{\\diff{x y^{2},\\wrt{y}},\\wrt{x}}');
            cxt.addExpr(z);

            z.resolver.resolveDeepTree(() => {
                expect(z.resolver.deepFormulaTree.toShorthand()).to.deep.eq({
                    op: UC.ImplicitM,
                    left: '2',
                    right: 'y',
                });

                done();
            });
        });

        xit('User defined function equals a derivative inside a derivative with another user defined function', () => {
            const cxt = new MathContext();

            const y = MathExpr.fromExpr('\\dfunc{y,x}=x^{2}');
            cxt.addExpr(y);

            const z = new MathExpr();
            z.updateExpr('\\dfunc{z,x}=\\diff{\\diff{x y^{2},\\wrt{y}},\\wrt{x}}');
            cxt.addExpr(z);

            // TODO: fix this
            expect(true).to.be.false;
        });

        xit('Derivative inside derivative with defined variable', () => {
            const cxt = new MathContext();

            const x = new MathExpr();
            x.updateExpr('x=20');

            const z = new MathExpr();
            z.updateExpr('z=\\diff{\\wrt{x},\\diff{\\wrt{y},x^{2}y}}');

            cxt.addExpr(x);
            cxt.addExpr(z);

            // TODO: fix this
            expect(true).to.be.false;
        });

        xit('Function defined as derivative', () => {
            const cxt = new MathContext();

            const x = new MathExpr();
            x.updateExpr('x=8');

            const f = new MathExpr();
            f.updateExpr('\\dfunc{f,x}=x+8');

            const h = new MathExpr();
            h.updateExpr('\\dfunc{h,x}=\\diff{\\wrt{x},x^{3}}');

            cxt.addExpr(x);
            cxt.addExpr(f);
            cxt.addExpr(h);

            // TODO: fix this
            expect(true).to.be.false;
        });

        xit('Derivative with invoked user defined function', () => {
            doDerivativeStub.callsFake((req, cb) => cb(null, { resultAsPython: '16' }));

            const cxt = new MathContext();

            const f = new MathExpr();
            f.updateExpr('\\dfunc{f,x}=x^{2}');

            const h = new MathExpr();
            h.updateExpr('h=\\diff{\\wrt{y},y f(4)}');

            cxt.addExpr(f);
            cxt.addExpr(h);

            // TODO: fix this
            expect(true).to.be.false;
        });

        xit('Derivative with invoked user defined function', () => {
            doDerivativeStub.callsFake((req, cb) => cb(null, { resultAsPython: '16' }));

            const cxt = new MathContext();

            const f = new MathExpr();
            f.updateExpr('\\dfunc{f,x}=x^{2}');

            const h = new MathExpr();
            h.updateExpr('h=\\diff{\\wrt{y},y f(y)}');

            cxt.addExpr(f);
            cxt.addExpr(h);

            // TODO: fix this
            expect(true).to.be.false;
        });

        xit('Derivative inside derivative with defined variable', () => {
            doDerivativeStub.callsFake((req, cb) => cb(null, { resultAsPython: 'x^{3}' }));

            const cxt = new MathContext();

            const x = new MathExpr();
            x.updateExpr('x=20');

            const z = new MathExpr();
            z.updateExpr('z=\\diff{\\wrt{x},\\diff{\\wrt{y},x^{3}y}}');

            cxt.addExpr(x);
            cxt.addExpr(z);

            expect(doDerivativeStub.getCall(0).args[0].expr).to.eq('x**3*y');
            expect(doDerivativeStub.getCall(1).args[0].expr).to.eq('x**3');
        });

        it('Function defined as derivative', (done) => {
            doDerivativeStub.callsFake((req, cb) => cb(null, { resultAsPython: '4*x**3' }));

            const cxt = new MathContext();

            const x = new MathExpr();
            x.updateExpr('x=8');

            const f = new MathExpr();
            f.updateExpr('\\dfunc{f,x}=x+8');

            const h = new MathExpr();
            h.updateExpr('\\dfunc{h,x}=\\diff{x^{4},\\wrt{x}}');

            const hInvocation = new MathExpr();
            hInvocation.updateExpr('h(2)');

            cxt.addExpr(x);
            cxt.addExpr(f);
            cxt.addExpr(h);
            cxt.addExpr(hInvocation);

            hInvocation.resolver.resolveDeepTree((err, tree) => {
                expect(hInvocation.resolver.primitiveNumber).to.eq(32);
                done();
            });
        });
    });

    describe('Circular Dependencies', () => {

        it('simple circular dep', () => {
            const cxt = new MathContext();
            const expr1 = MathExpr.fromExpr('y=x');
            const expr2 = MathExpr.fromExpr('x=y');
            cxt.addExpr(expr1);
            cxt.addExpr(expr2);

            setTimeout(() => {
                expect(expr2.hasError, 'expr2 has error').to.be.true;
                expect(expr1.hasError, 'expr1 has error').to.be.true;
            });
        });
    });
});
