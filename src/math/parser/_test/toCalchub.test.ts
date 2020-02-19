import { expect } from 'chai';
import { parseCalchub } from '../../internal';

describe('toCalchub', () => {

    it('works with full expressions', () => {
        [
            {
                expr: '\\sin{5}',
                calchub: '\\sin{5}',
            },
            {
                expr: 'x^2',
                calchub: 'x^{2}',
            },
            {
                expr: 'y=10',
                calchub: 'y=10',
            },
            {
                expr: '(x+2)^2',
                calchub: '(x+2)^{2}',
            },
            {
                expr: '\\dfunc{f,x}=  10',
                calchub: '\\dfunc{f,x}=10',
            },
            {
                expr: '\\chsum{10,11,12}',
                calchub: '\\chsum{10,11,12}',
            },
            {
                expr: '2x',
                calchub: '2 x',
            },
            {
                expr: '-2.10',
                calchub: '-2.10',
            },
            {
                expr: '\\frac{1,2}',
                calchub: '\\frac{1,2}',
            },
            {
                expr: '\\frac{1+2,-x}',
                calchub: '\\frac{1+2,-x}',
            },
            {
                expr: '2+\\frac{1+2,x}',
                calchub: '2+\\frac{1+2,x}',
            },
            {
                expr: '\\arccos{\\pi}',
                calchub: '\\arccos{\\pi}',
            },
        ].forEach(test => {
            const { expr, calchub } = test;
            const { root } = parseCalchub(expr);
            expect(root.toCalchub().expr, `error with ${expr}`).to.eq(calchub);
        });
    });
});
