import { expect } from 'chai';
import { parseCalchub, UC } from '../../internal';

describe('Parser.calchub', () => {

    it('evaluation', () => {
        [
            {
                expr: '5+6-1',
                value: 10,
            },
            {
                expr: '\\sqrt{4}',
                value: 2,
            },
            {
                expr: '2^3',
                value: 8,
            },
            {
                expr: '2*2',
                value: 4,
            },
            {
                expr: '(1+2)*2',
                value: 6,
            },
            {
                expr: '\\frac{4,2}',
                value: 2,
            },
            {
                expr: '\\frac{4,2}\\frac{4,2}',
                value: 4,
            },
        ].forEach(test => {
            const { expr, value } = test;
            const { root } = parseCalchub(expr);
            expect(root.simplify().primitiveNumber).to.eq(value);
        });
    });

    it('evaluation: closeTo', () => {
        [
            {
                expr: '\\pi',
                value: 3.1415
            },
            {
                expr: 'e',
                value: 2.718
            }
        ].forEach(test => {
            const { expr, value } = test;
            const { root } = parseCalchub(expr);
            expect(root.simplify().primitiveNumber).to.be.closeTo(value, 0.001);
        });
    });

    it('works', () => {
        [
            {
                expr: 'i=\\diff{4y^{2},\\wrt{y}}\\frac{\\diff{4y,\\wrt{y}},8}',
                shorthand: {
                    op: '=',
                    left: 'i',
                    right: {
                        op: UC.ImplicitM,
                        left: {
                            op: '\\diff',
                            left: {
                                op: ',',
                                left: {
                                    op: UC.ImplicitM,
                                    left: '4',
                                    right: {
                                        op: '^',
                                        left: 'loc:y',
                                        right: '2'
                                    }
                                },
                                right: {
                                    op: '\\wrt',
                                    left: 'loc:y'
                                }
                            }
                        },
                        right: {
                            op: '\\frac',
                            left: {
                                op: ',',
                                left: {
                                    op: '\\diff',
                                    left: {
                                        op: ',',
                                        left: {
                                            op: UC.ImplicitM,
                                            left: '4',
                                            right: 'loc:y'
                                        },
                                        right: {
                                            op: '\\wrt',
                                            left: 'loc:y'
                                        }
                                    }
                                },
                                right: '8'
                            }
                        }
                    }
                }
            },
            {
                expr: 'j=\\diff{9*\\frac{x,x^{2}},\\wrt{x}}',
                shorthand: {
                    op: '=',
                    left: 'j',
                    right: {
                        op: '\\diff',
                        left: {
                            op: ',',
                            left: {
                                op: '*',
                                left: '9',
                                right: {
                                    op: '\\frac',
                                    left: {
                                        op: ',',
                                        left: 'loc:x',
                                        right: {
                                            op: '^',
                                            left: 'loc:x',
                                            right: '2',
                                        }
                                    }
                                }
                            },
                            right: {
                                op: '\\wrt',
                                left: 'loc:x',
                            }
                        }
                    }
                }
            },
            {
                expr: '=x^{2}\\cos(t)',
                shorthand: {
                    op: '=',
                    left: '?',
                    right: {
                        op: UC.ImplicitM,
                        left: {
                            op: '^',
                            left: 'x',
                            right: '2',
                        },
                        right: {
                            op: '\\cos',
                            left: {
                                op: '()',
                                left: 't'
                            }
                        }
                    }
                },
            },
            {
                expr: '(1/4)e^0',
                shorthand: {
                    op: UC.ImplicitM,
                    left: {
                        op: '()',
                        left: {
                            op: '/',
                            left: '1',
                            right: '4'
                        }
                    },
                    right: {
                        op: '^',
                        left: 'e',
                        right: '0',
                    }
                },
            },
            {
                description: 'fraction',
                expr: '7+\\frac{10,2}*3',
                shorthand: {
                    op: '+',
                    left: '7',
                    right: {
                        op: '*',
                        left: {
                            op: '\\frac',
                            left: {
                                op: ',',
                                left: '10',
                                right: '2',
                            }
                        },
                        right: '3',
                    }
                },
            },
            {
                description: 'greek and function',
                expr: '-\\alpha\\sin\\theta',
                shorthand: {
                    op: UC.ImplicitM,
                    left: {
                        op: 'neg',
                        left: '\\alpha',
                    },
                    right: {
                        op: '\\sin',
                        left: '\\theta'
                    }
                },
            },
            {
                description: 'greek letters',
                expr: '\\alpha',
                shorthand: '\\alpha',
            },
            {
                description: 'infinity',
                expr:'\\inf',
                shorthand: '\\inf',
            },
            // {
            //     description: 'greek letters',
            //     expr: '\\alpha\\beta',
            //     shorthand: '\\alpha\\beta',
            // },
        ].forEach(test => {
            const { expr, shorthand } = test;
            const { root } = parseCalchub(expr);
            expect(root.only.toShorthand()).to.deep.eq(shorthand);
        });
    });

    it('arrays', () => {
        [
            {
                expr: '[1]',
                shorthand: {
                    op: '[]',
                    items: ['1'],
                }
            },
            {
                expr: '[1,2]',
                shorthand: {
                    op: '[]',
                    items: ['1', '2'],
                }
            },
            {
                expr: '[-1,2+3]',
                shorthand: {
                    op: '[]',
                    items: [
                        {
                            op: 'neg',
                            left: '1',
                        },
                        {
                            op: '+',
                            left: '2',
                            right: '3'
                        },
                    ],
                }
            },
            {
                expr: '[[1,2],[3,4]]',
                shorthand: {
                    op: '[]',
                    items: [
                        {
                            op: '[]',
                            items: ['1', '2'],
                        },
                        {
                            op: '[]',
                            items: ['3', '4'],
                        },
                    ],
                }
            }
        ].forEach(test => {
            const { expr, shorthand } = test;
            const { root } = parseCalchub(expr);
            expect(root.only.toShorthand()).to.deep.eq(shorthand);
        });
    });

});
