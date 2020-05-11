import { expect } from 'chai';
import { parseCalchub } from "../Parser";
import { extractFractionNumerator } from '../utils/extractFractionNumerator';

describe('extractFactionNumerator', () => {
    it('basic test', () => {
        [
            {
                expr: '8',
                expected: '8'
            },
            {
                expr: 'x*2',
                expected: {
                    op: '*',
                    left: 'x',
                    right: '2'
                }
            },
            {
                expr: '2x+4',
                expected: '4'
            },
            {
                expr: '6+(3x-2)',
                expected: {
                    op: '()',
                    left: {
                        op: '-',
                        left: {
                            op: '\u229B',
                            left: '3',
                            right: 'x'
                        },
                        right: '2'
                    }
                }
            },
            {
                expr: '(x-2)',
                expected: {
                    op: '()',
                    left: {
                        op: '-',
                        left: 'x',
                        right: '2'
                    }
                }
            },
            {
                expr: '\\sin{t}',
                expected: {
                    op: '\\sin',
                    left: 't'
                }
            },
            {
                expr: '8+\\sin{t}',
                expected: {
                    op: '\\sin',
                    left: 't'
                }
            },
            {
                expr: '\\frac{x,y}-7t',
                expected: {
                    op: '\u229B',
                    left: '7',
                    right: 't'
                }
            },
            {
                expr: '5\\frac{x,y}',
                expected: {
                    op: '\u229B',
                    left: '5',
                    right: {
                        op: '\\frac',
                        left: {
                            op: ',',
                            left: 'x',
                            right: 'y'
                        }
                    }
                }
            },
            {
                expr: '4t+8y',
                expected: {
                    op: '\u229B',
                    left: '8',
                    right: 'y'
                }
            },
            {
                expr: '4t+8*9*x',
                expected: {
                    op: '*',
                    left: {
                        op: '*',
                        left: '8',
                        right: '9'
                    },
                    right: 'x'
                }
            }
        ].forEach(test => {
            const { expr, expected } = test;
            const { root } = parseCalchub(expr);
            const node = extractFractionNumerator(root);
            expect(node.toShorthand()).to.deep.eq(expected);
        });
    });
});