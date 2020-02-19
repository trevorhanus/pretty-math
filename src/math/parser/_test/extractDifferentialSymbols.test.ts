import { expect } from 'chai';
import { extractDifferentialSymbolNames, parseCalchub } from '../../internal';

describe('extractDifferentialSymbols', () => {

    it('valid exprs', () => {
        [
            {
                expr: '\\wrt{}',
                expected: [],
            },
            {
                expr: '\\wrt{x}',
                expected: ['x'],
            },
            {
                expr: '\\wrt{xz}',
                expected: ['xz'],
            },
            {
                expr: '\\wrt{x}\\wrt{z}',
                expected: ['x', 'z'],
            },
            {
                expr: '\\wrt{x}^{2}',
                expected: ['x', 'x'],
            },
            {
                expr: '\\wrt{x^3}',
                expected: ['x', 'x', 'x'],
            },
            {
                expr: '\\wrt{x}\\wrt{z}^3',
                expected: ['x', 'z', 'z', 'z'],
            },
        ].forEach(test => {
            const { expr, expected } = test;
            const { root } = parseCalchub(expr);
            const symbols = extractDifferentialSymbolNames(root.only);
            expect(expected).to.deep.eq(symbols);
        });
    });

    it('throws on invalid exprs', () => {
        [
            {
                error: 'non integer power',
                expr: '\\wrt{x}^{2.1}',
            },
            {
                error: 'negative power',
                expr: '\\wrt{x}^{-2}',
            },
            {
                error: 'power in a power',
                expr: '\\wrt{x^3}^2',
            },
            {
                error: 'no differential function',
                expr: 'x^2',
            },
            {
                error: 'no differential function',
                expr: 'x',
            }
        ].forEach(test => {
            const { expr } = test;

            expect(() => {
                const { root } = parseCalchub(expr);
                extractDifferentialSymbolNames(root.only);
            }).to.throw();
        });
    });
});
