import { expect } from 'chai';
import { DerivativeNode, extractDifferentialSymbolNames, NodeType, parseCalchub } from '../../internal';

describe('DerivativeNode', () => {

    it('happy path', () => {
        const expr = '\\diff{x^2,\\wrt{x}\\wrt{x}}';
        const { root } = parseCalchub(expr);

        const dn = root.only as DerivativeNode;
        expect(dn.isSymbolic).to.be.true;
        expect(dn.type).to.eq(NodeType.Operator);
        expect(dn).to.be.an.instanceOf(DerivativeNode);

        expect(dn.expression.toShorthand()).to.deep.eq({
            op: '^',
            left: 'loc:x',
            right: '2',
        });

        expect(dn.wrt.toShorthand()).to.deep.eq({
            op: '\u229B',
            left: {
                op: '\\wrt',
                left: 'loc:x',
            },
            right: {
                op: '\\wrt',
                left: 'loc:x',
            }
        });
    });

    describe('extractDifferentialSymbolNames', () => {

        it('valid exprs', () => {
            [
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
                const symbols = extractDifferentialSymbolNames(root);
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
                    extractDifferentialSymbolNames(root);
                }).to.throw();
            });
        });

    });

});
