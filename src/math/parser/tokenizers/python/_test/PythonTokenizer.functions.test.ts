import { expect } from 'chai';
import { tokenizePython, toShorthand } from '../../../../internal';

describe('PythonTokenizer:functions', () => {

    it('trig functions', () => {
        [
            {
                expr: 'sin()',
                shorthand: '[sin] [(] [)]',
            },
            {
                expr: 'cos',
                shorthand: '[cos]',
            },
            {
                expr: 'tan',
                shorthand: '[tan]',
            },
        ].forEach(test => {
            const { shorthand, expr } = test;
            const { tokens } = tokenizePython(expr);
            expect(toShorthand(tokens), `error at ${expr}`).to.eq(shorthand);
        });
    });

    it('calculus functions', () => {
        [
            {
                expr: 'diff',
                shorthand: '[diff]',
            },
            {
                expr: 'diff(x,x)',
                shorthand: '[diff] [(] [s:x] [,] [s:x] [)]',
            },
        ].forEach(test => {
            const { shorthand, expr } = test;
            const { tokens } = tokenizePython(expr);
            expect(toShorthand(tokens), `error at ${expr}`).to.eq(shorthand);
        });
    });

    it('functions', () => {
        [
            {
                expr: 'Max',
                shorthand: '[max]',
            },
            {
                expr: 'Min',
                shorthand: '[min]',
            },
        ].forEach(test => {
            const { shorthand, expr } = test;
            const { tokens } = tokenizePython(expr);
            expect(toShorthand(tokens), `error at ${expr}`).to.eq(shorthand);
        });
    });

    it('normal functions', () => {
        [
            {
                expr: 'sin',
                shorthand: '[sin]',
            },
            {
                expr: 'sin(a)',
                shorthand: '[sin] [(] [s:a] [)]',
            },
            {
                expr: 'sqrt(4)',
                shorthand: '[sqrt] [(] [l:4] [)]',
            },
            {
                expr: 'ln(5.0)',
                shorthand: '[ln] [(] [l:5.0] [)]',
            },
        ].forEach(test => {
            const { shorthand, expr } = test;
            const { tokens } = tokenizePython(expr);
            expect(toShorthand(tokens), `error at ${expr}`).to.eq(shorthand);
        });
    });
});
