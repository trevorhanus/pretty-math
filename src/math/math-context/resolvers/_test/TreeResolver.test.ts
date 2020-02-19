import { expect } from 'chai';
import { MathContext, MathExpr, parseCalchub, resolveTree } from '../../../internal';

describe('TreeResolver', () => {

    describe('resolveTree', () => {

        it('no dependencies', (done) => {
            const mathCxt = new MathContext();
            const { root } = parseCalchub('10+10', mathCxt.fnNames);

            resolveTree(root, { cxt: mathCxt }, (e, tree) => {
                expect(tree.toShorthand()).to.deep.eq(root.toShorthand());
                done();
            });
        });

        it('define command', (done) => {
            const mathCxt = new MathContext();
            const { root } = parseCalchub('a=10', mathCxt.fnNames);

            resolveTree(root, { cxt: mathCxt }, (e, tree) => {
                expect(tree.toShorthand()).to.deep.eq(root.toShorthand());
                done();
            });
        });

        it('respects local symbols', (done) => {
            const mathCxt = new MathContext();
            const a = MathExpr.fromExpr('a=10');
            mathCxt.addExpr(a);

            const { root } = parseCalchub('\\dfunc{f,a}=a+10', mathCxt.fnNames);

            resolveTree(root, { cxt: mathCxt }, (e, tree) => {
                expect(tree.toShorthand()).to.deep.eq(root.toShorthand());
                done();
            });
        });

        it('prefer local scope over context', (done) => {
            const mathCxt = new MathContext();

            const a = MathExpr.fromExpr('a=10');
            mathCxt.addExpr(a);

            const { root } = parseCalchub('a+10', mathCxt.fnNames);

            const localScope = {
                a: parseCalchub('25').root.only,
            };

            resolveTree(root.only, { cxt: mathCxt, localScope }, (e, tree) => {
                expect(tree.simplify().primitiveNumber).to.eq(35);
                done();
            });
        });

        it('user defined function invocation with literal', (done) => {
            const mathCxt = new MathContext();
            const f = MathExpr.fromExpr('\\dfunc{f,x}=x+10');
            mathCxt.addExpr(f);

            const { root } = parseCalchub('f(9)', mathCxt.fnNames);

            resolveTree(root.only, {cxt: mathCxt }, (e, tree) => {
                expect(tree.simplify().primitiveNumber).to.eq(19);
                done();
            });
        });

        it('user defined function invocation with different symbol', (done) => {
            const mathCxt = new MathContext();
            const f = MathExpr.fromExpr('\\dfunc{f,x}=x+10');
            mathCxt.addExpr(f);

            const { root } = parseCalchub('f(t)', mathCxt.fnNames);

            resolveTree(root.only, { cxt: mathCxt }, (e, tree) => {
                const expected = {
                    op: '+',
                    left: 't',
                    right: '10',
                };

                expect(tree.toShorthand()).to.deep.eq(expected);
                done();
            });

        });

        it('user defined function invocation with a variable defined in the context', (done) => {
            const mathCxt = new MathContext();
            const a = MathExpr.fromExpr('a=10');
            mathCxt.addExpr(a);
            const f = MathExpr.fromExpr('\\dfunc{f,x}=x+10');
            mathCxt.addExpr(f);

            const { root } = parseCalchub('f(a)', mathCxt.fnNames);

            resolveTree(root.only, { cxt: mathCxt }, (e, tree) => {
                expect(tree.simplify().primitiveNumber).to.eq(20);
                done();
            });
        });
    });
});
