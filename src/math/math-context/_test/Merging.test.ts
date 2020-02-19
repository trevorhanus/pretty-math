import { expect } from 'chai';
import { MathContext } from '../../internal';

describe('Merging MathContexts', () => {

    it('can merge 2 contexts without any conflicts', () => {
        const cxt1 = new MathContext();
        const a = cxt1.createExpr('a = 10');
        cxt1.addExpr(a);

        const cxt2 = new MathContext();
        const b = cxt1.createExpr('b = 10');
        cxt2.addExpr(b);

        cxt1.merge(cxt2);

        expect(cxt1.exprs.length).to.eq(2);
    });

    it('knows when there are conflicts', () => {
        const cxt1 = new MathContext();
        const a = cxt1.createExpr('a = 10');
        const b1 = cxt1.createExpr('b = 10');
        cxt1.addExpr(a);
        cxt1.addExpr(b1);

        const cxt2 = new MathContext();
        const b = cxt1.createExpr('b = 10');
        cxt2.addExpr(b);

        const conflicts = cxt1.getMergeConflicts(cxt2);

        expect(conflicts.length).to.eq(1);
    });

    it('throws when there are conflicts', () => {
        const cxt1 = new MathContext();
        const a = cxt1.createExpr('a = 10');
        const b1 = cxt1.createExpr('b = 10');
        cxt1.addExpr(a);
        cxt1.addExpr(b1);

        const cxt2 = new MathContext();
        const b = cxt1.createExpr('b = 10');
        cxt2.addExpr(b);

        expect(() => {
            cxt1.merge(cxt2);
        }).to.throw();
    });
});
