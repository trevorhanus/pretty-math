import { expect } from 'chai';
import { tokenizeCalchub, toShorthand } from '../../../../internal';

describe('CalchubTokenizer:functions', () => {

    it('trig functions', () => {
        [
            {
                expr: '\\sin',
                shorthand: '[sin]',
            },
            {
                expr: '\\cos',
                shorthand: '[cos]',
            },
            {
                expr: '\\tan',
                shorthand: '[tan]',
            },
        ].forEach(test => {
            const { shorthand, expr } = test;
            const { tokens } = tokenizeCalchub(expr);
            expect(toShorthand(tokens), `error at ${expr}`).to.eq(shorthand);
        });
    });

    it('calculus functions', () => {
        [
            {
                expr: '\\diff',
                shorthand: '[diff]',
            },
            {
                expr: '\\diff{x,\\wrt{x}}',
                shorthand: '[diff] [{] [s:x] [,] [wrt] [{] [s:x] [}] [}]',
            },
        ].forEach(test => {
            const { shorthand, expr } = test;
            const { tokens } = tokenizeCalchub(expr);
            expect(toShorthand(tokens), `error at ${expr}`).to.eq(shorthand);
        });
    });

    it('functions', () => {
        [
            {
                expr: '\\chmax',
                shorthand: '[max]',
            },
            {
                expr: '\\chmin',
                shorthand: '[min]',
            },
            {
                expr: '\\chsum',
                shorthand: '[sum]',
            },
        ].forEach(test => {
            const { shorthand, expr } = test;
            const { tokens } = tokenizeCalchub(expr);
            expect(toShorthand(tokens), `error at ${expr}`).to.eq(shorthand);
        });
    });

    it('normal functions', () => {
        [
            {
                expr: '\\sin',
                shorthand: '[sin]',
            },
            {
                expr: '\\sin(a)',
                shorthand: '[sin] [(] [s:a] [)]',
            },
            {
                expr: '\\cdot',
                shorthand: '[*]',
            },
            {
                expr: '\\sqrt{4}',
                shorthand: '[sqrt] [{] [l:4] [}]',
            },
            {
                expr: '\\log 4',
                shorthand: '[log] [ ] [l:4]',
            },
            {
                expr: '\\frac{V}{I}',
                shorthand: '[frac] [{] [s:V] [}] [{] [s:I] [}]',
            },
            {
                expr: '\\ln{(5)}-\\ln{(4)}',
                shorthand: '[ln] [{] [(] [l:5] [)] [}] [-] [ln] [{] [(] [l:4] [)] [}]',
            },
            {
                expr: '\\dfunc{x}',
                shorthand: '[dfunc] [{] [s:x] [}]',
            },
            {
                expr: '\\dfunc{x,y}=',
                shorthand: '[dfunc] [{] [s:x] [,] [s:y] [}] [=]',
            },
            {
                expr: 'f(5)',
                shorthand: '[s:f] [(] [l:5] [)]',
            },
        ].forEach(test => {
            const { shorthand, expr } = test;
            const { tokens } = tokenizeCalchub(expr);
            expect(toShorthand(tokens), `error at ${expr}`).to.eq(shorthand);
        });
    });
});
