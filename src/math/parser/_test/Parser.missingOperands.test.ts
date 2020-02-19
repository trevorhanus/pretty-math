import { expect } from 'chai';
import { parseCalchub } from '../../internal';

describe('Parser.missingOperands', () => {

    it('Missing Operands', () => {
        [
            // Left Associative Unary Operator
            {
                descr: 'null to the left',
                expr: '!',
                expected: {
                    op: '!',
                    left: '?',
                }
            },
            {
                descr: 'left parens on left',
                expr: '(!)',
                expected: {
                    op: '!',
                    left: '?',
                }
            },
            {
                descr: 'right assoc unary op',
                expr: '-!',
                expected: {
                    op: 'neg',
                    left: {
                        op: '!',
                        left: '?'
                    },
                }
            },
            {
                descr: 'binary op',
                expr: '+!',
                expected: {
                    op: '+',
                    left: '?',
                    right: {
                        op: '!',
                        left: '?'
                    },
                }
            },
            {
                descr: 'func',
                expr: '\\sin !',
                expected: {
                    op: '\\sin',
                    left: {
                        op: '!',
                        left: '?'
                    },
                }
            },

            // Right Associative Unary Operator

            {
                descr: 'unary op: null on right',
                expr: '-',
                expected: {
                    op: 'neg',
                    left: '?',
                }
            },
            {
                descr: 'unary op: right parens on right',
                expr: '(4 * -)',
                expected: {
                    op: '*',
                    left: '4',
                    right: {
                        op: 'neg',
                        left: '?',
                    }
                }
            },
            {
                descr: 'unary op: left assoc unary on right',
                expr: '-!',
                expected: {
                    op: 'neg',
                    left: {
                        op: '!',
                        left: '?',
                    }
                }
            },
            {
                descr: 'unary op: binary op on right',
                expr: '-+',
                expected: {
                    op: '+',
                    left: {
                        op: 'neg',
                        left: '?',
                    },
                    right: '?',
                }
            },

            // Binary Operators

            {
                descr: 'binary op, null on left',
                expr: '+6',
                expected: {
                    op: '+',
                    left: '?',
                    right: '6'
                }
            },
            {
                descr: 'binary op: left parens on left',
                expr: '(+6)',
                expected: {
                    op: '+',
                    left: '?',
                    right: '6'
                }
            },
            {
                descr: 'binary op: two binary ops',
                expr: '(*+)',
                expected: {
                    op: '+',
                    left: {
                        op: '*',
                        left: '?',
                        right: '?',
                    },
                    right: '?'
                }
            },
            {
                descr: 'binary op: func on left',
                expr: '\\sin +',
                expected: {
                    op: '+',
                    left: {
                        op: '\\sin',
                        left: '?',
                    },
                    right: '?'
                }
            },
            {
                descr: 'binary op: null on right',
                expr: '5+6-',
                expected: {
                    op: '-',
                    left: {
                        op: '+',
                        left: '5',
                        right: '6'
                    },
                    right: '?'
                }
            },
            {
                descr: 'binary op: null on right',
                expr: '5+',
                expected: {
                    op: '+',
                    left: '5',
                    right: '?'
                }
            },
            {
                descr: 'binary op: right parens on right',
                expr: '(5+)',
                expected: {
                    op: '+',
                    left: '5',
                    right: '?'
                }
            },
            {
                descr: 'binary op: right parens on right',
                expr: '++',
                expected: {
                    op: '+',
                    left: {
                        op: '+',
                        left: '?',
                        right: '?',
                    },
                    right: '?'
                }
            },

            // Functions

            {
                descr: 'func: null',
                expr: '\\sin',
                expected: {
                    op: '\\sin',
                    left: '?'
                }
            },

            // Empty parens

            {
                descr: 'parens: empty',
                expr: '()',
                expected: '?'
            },
        ].forEach(test => {
            const { expr, expected, descr } = test;
            const { root, error } = parseCalchub(expr);

            if (error) {
                console.log(error);
            }

            expect(root.only.toShorthand(), `${descr}: ${expr}`).to.deep.eq(expected);
        });
    });
});
