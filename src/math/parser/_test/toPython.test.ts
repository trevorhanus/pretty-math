import { expect } from 'chai';
import * as sinon from 'sinon';
import { parseCalchub } from '../../internal';
import * as PythonSymbols from '../../utils/PythonSafeSymbols';

describe('toPython', () => {

    before(() => {
        sinon.stub(PythonSymbols, 'getPythonSafeSymbol').callsFake((symbol => symbol));
    });

    after(() => {
        sinon.restore();
    });

    it('works with full expressions', () => {
        [
            {
                expr: '\\sin{5}',
                python: 'sin(5)',
            },
            {
                expr: 'x^2',
                python: 'x**2',
            },
            {
                expr: 'y=10',
                python: 'y = 10',
            },
            {
                expr: '(x+2)^2',
                python: '(x+2)**2',
            },
            {
                expr: '\\dfunc{f,x}=  10',
                python: 'define(f,x) = 10',
            },
            {
                expr: '\\chsum{10,11,12}',
                python: 'sum(10,11,12)',
            },
            {
                expr: '2x',
                python: '2*x',
            },
            {
                expr: '-2.10',
                python: '-2.10',
            },
            {
                expr: '\\frac{1,2}',
                python: '(1)/(2)',
            },
            {
                expr: '\\frac{1+2,-x}',
                python: '(1+2)/(-x)',
            },
            {
                expr: '2+\\frac{1+2,x}',
                python: '2+(1+2)/(x)',
            },
        ].forEach(test => {
            const { expr, python } = test;
            const { root } = parseCalchub(expr);
            expect(root.toPython().expr, `error with ${expr}`).to.eq(python);
        });
    });
});
