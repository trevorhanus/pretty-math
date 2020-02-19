import { expect } from 'chai';
import { BlockType, buildChainFromCalchub, ChainBuilder } from 'pretty-math/internal';
import { chainEquals } from 'pretty-math/blocks/_test/testutils';

const {
    Block,
    Fraction,
} = BlockType;

describe('ChainBuilder2', () => {

    it('empties', () => {
        expect(ChainBuilder.buildChainFromMath(undefined)).to.eq(null);
        expect(ChainBuilder.buildChainFromMath(null)).to.eq(null);
        expect(ChainBuilder.buildChainFromMath('')).to.eq(null);
    });

    it('a simple word', () => {
        const expr = 'foo';
        const js = [
            {
                type: BlockType.Block,
                text: 'f'
            },
            {
                type: BlockType.Block,
                text: 'o'
            },
            {
                type: BlockType.Block,
                text: 'o'
            }
        ];

        const chain = ChainBuilder.buildChainFromMath(expr);
        chainEquals(chain, js);
    });

    it('a literal with e-notation', () => {
        const expr = '6e10';
        const js = [
            {
                type: BlockType.Block,
                text: '6'
            },
            {
                type: BlockType.Block,
                text: 'e'
            },
            {
                type: BlockType.Block,
                text: '1'
            },
            {
                type: BlockType.Block,
                text: '0'
            }
        ];

        const chain = buildChainFromCalchub(expr);
        chainEquals(chain, js);
    });

    it('fraction', () => {
        const expr = '\\frac{1,2}';
        const js = [
            {
                type: BlockType.Fraction,
                num: [
                    {
                        type: BlockType.Block,
                        text: '1',
                    }
                ],
                denom: [
                    {
                        type: BlockType.Block,
                        text: '2',
                    }
                ]
            },
        ];

        const chain = ChainBuilder.buildChainFromMath(expr);
        chainEquals(chain, js);
    });

    it('a literal', () => {
        const expr = '10.2';
        const js = [
            {
                type: BlockType.Block,
                text: '1'
            },
            {
                type: BlockType.Block,
                text: '0'
            },
            {
                type: BlockType.Block,
                text: '.'
            },
            {
                type: BlockType.Block,
                text: '2'
            }
        ];

        const chain = buildChainFromCalchub(expr);
        chainEquals(chain, js);
    });

    it('a latex constant', () => {
        const expr = '\\pi';
        const js = [
            {
                type: BlockType.Block,
                text: 'π',
                latex: '\\pi',
            },
        ];

        const chain = buildChainFromCalchub(expr);
        chainEquals(chain, js);
    });

    it('unary minus', () => {
        const expr = '-9/x^2';
        const js = [
            {
                type: BlockType.Block,
                text: '-',
            },
            {
                type: BlockType.Block,
                text: '9',
            },
            {
                type: BlockType.Block,
                text: '/',
            },
            {
                type: BlockType.Block,
                text: 'x',
            },
            {
                type: BlockType.SupSub,
                sup: [
                    {
                        type: Block,
                        text: '2',
                    },
                ]
            },
        ];

        const chain = ChainBuilder.buildChainFromMath(expr);
        chainEquals(chain, js);
    });

    it('derivative with fraction', () => {
        const expr = 'j=\\diff{9*\\frac{x,x^{2}},\\wrt{x}}';
        const js = [
            {
                type: Block,
                text: 'j',
            },
            {
                type: Block,
                text: '=',
            },
            {
                type: BlockType.Derivative,
                inner: [
                    {
                        type: Block,
                        text: '9',
                    },
                    {
                        type: Block,
                        text: '*',
                    },
                    {
                        type: Fraction,
                        num: [
                            {
                                type: Block,
                                text: 'x',
                            },
                        ],
                        denom: [
                            {
                                type: Block,
                                text: 'x',
                            },
                            {
                                type: BlockType.SupSub,
                                sup: [
                                    {
                                        type: Block,
                                        text: '2',
                                    },
                                ]
                            },
                        ]
                    },
                ],
                wrt: [
                    {
                        type: BlockType.Differential,
                        text: 'd',
                        latex: '\\wrt',
                        inner: [
                            {
                                type: Block,
                                text: 'x',
                            },
                        ]
                    },
                ]
            },
        ];

        const chain = ChainBuilder.buildChainFromMath(expr);
        chainEquals(chain, js);
    });

    it('binary op with only left operand', () => {
        const expr = '1 +';
        const js = [
            {
                type: BlockType.Block,
                text: '1'
            },
            {
                type: BlockType.Block,
                text: '+'
            },
        ];

        const chain = buildChainFromCalchub(expr);
        chainEquals(chain, js);
    });

    it('power with operands', () => {
        const expr = 'a^2';

        const js = [
            {
                type: BlockType.Block,
                text: 'a'
            },
            {
                type: BlockType.SupSub,
                sup: [
                    {
                        type: BlockType.Block,
                        text: '2'
                    },
                ]
            },
        ];

        const chain = buildChainFromCalchub(expr);
        chainEquals(chain, js);
    });

    it('unary op', () => {
        const expr = '-a';

        const js = [
            {
                type: BlockType.Block,
                text: '-'
            },
            {
                type: BlockType.Block,
                text: 'a'
            },
        ];

        const chain = buildChainFromCalchub(expr);
        chainEquals(chain, js);
    });

    it('defining a function', () => {
        const expr = '\\dfunc{f,x}';

        const js = [
            {
                type: BlockType.DefineFunction,
                funcName: [
                    {
                        type: BlockType.Block,
                        text: 'f'
                    }
                ],
                inner: [
                    {
                        type: BlockType.Block,
                        text: 'x'
                    }
                ]
            },
        ];

        const chain = buildChainFromCalchub(expr);
        chainEquals(chain, js);
    });

    it('subscript', () => {
        const expr = 'x_i';

        const js = [
            {
                type: BlockType.Block,
                text: 'x'
            },
            {
                type: BlockType.SupSub,
                sub: [
                    {
                        type: BlockType.Block,
                        text: 'i'
                    },
                ]
            },
        ];

        const chain = buildChainFromCalchub(expr);
        chainEquals(chain, js);
    });

    it('subscript with hex content', () => {
        // a_{a}
        const expr = 'a_x007b0061007d';

        const js = [
            {
                type: BlockType.Block,
                text: 'a'
            },
            {
                type: BlockType.SupSub,
                sub: [
                    {
                        type: BlockType.Block,
                        text: 'a'
                    },
                ]
            },
        ];

        const chain = buildChainFromCalchub(expr);
        chainEquals(chain, js);
    });

    it('adjacent sup subs', () => {
        // a_{a}^2
        const expr = 'a_x007b0061007d^2';

        const js = [
            {
                type: BlockType.Block,
                text: 'a'
            },
            {
                type: BlockType.SupSub,
                sub: [
                    {
                        type: BlockType.Block,
                        text: 'a'
                    },
                ],
                sup: [
                    {
                        type: BlockType.Block,
                        text: '2'
                    },
                ]
            },
        ];

        const chain = buildChainFromCalchub(expr);
        chainEquals(chain, js);
    });

    it('differential', () => {
        const expr = '\\wrt{x}';

        const js = [
            {
                type: BlockType.Differential,
                text: 'd',
                inner: [
                    {
                        type: BlockType.Block,
                        text: 'x',
                    },
                ]
            }
        ];

        const chain = buildChainFromCalchub(expr);
        chainEquals(chain, js);
    });

    it('derivative function', () => {
        const chain = buildChainFromCalchub('\\diff{x^2,\\wrt{x}\\wrt{y}}');

        const js = [
            {
                type: BlockType.Derivative,
                inner: [
                    {
                        type: BlockType.Block,
                        text: 'x',
                    },
                    {
                        type: BlockType.SupSub,
                        sup: [
                            {
                                type: BlockType.Block,
                                text: '2',
                            },
                        ],
                    }
                ],
                wrt: [
                    {
                        type: BlockType.Differential,
                        text: 'd',
                        latex: '\\wrt',
                        inner: [
                            {
                                type: BlockType.Block,
                                text: 'x',
                            },
                        ],
                    },
                    {
                        type: BlockType.Differential,
                        text: 'd',
                        latex: '\\wrt',
                        inner: [
                            {
                                type: BlockType.Block,
                                text: 'y',
                            },
                        ],
                    }
                ]
            }
        ];

        chainEquals(chain, js);
    });

    it('define node - no left side', () => {
        const chain = buildChainFromCalchub('=2x');

        const js = [
            {
                type: BlockType.Block,
                text: '=',
            },
            {
                type: BlockType.Block,
                text: '2',
            },
            {
                type: BlockType.Block,
                text: 'x',
            },
        ];

        chainEquals(chain, js);
    });

    it('letters and greeks - no spaces', () => {
        const expr = 'xy\\beta\\alpha';

        const js = [
            {
                type: BlockType.Block,
                text: 'x'
            },
            {
                type: BlockType.Block,
                text: 'y'
            },
            {
                type: BlockType.Block,
                text: 'β',
                latex: '\\beta',
            },
            {
                type: BlockType.Block,
                text: 'α',
                latex: '\\alpha',
            },
        ];

        const chain = buildChainFromCalchub(expr);
        chainEquals(chain, js);
    });

    it('an integral', () => {
        const expr = '\\int{2x,\\wrt{x},-1,1}';
        const js = [
            {
                type: BlockType.Integral,
                inner: [
                    {
                        type: BlockType.Block,
                        text: '2',
                    },
                    {
                        type: BlockType.Block,
                        text: 'x',
                    },
                ],
                wrt: [
                    {
                        type: BlockType.Differential,
                        text: 'd',
                        latex: '\\wrt',
                        inner: [
                            {
                                type: BlockType.Block,
                                text: 'x'
                            }
                        ]
                    }
                ],
                leftBound: [
                    {
                        type: BlockType.Block,
                        text: '-',
                    },
                    {
                        type: BlockType.Block,
                        text: '1',
                    },
                ],
                rightBound: [
                    {
                        type: BlockType.Block,
                        text: '1',
                    },
                ],
            },
        ];

        const chain = buildChainFromCalchub(expr);
        expect(chain.toShorthand()).to.deep.eq(js);
        chainEquals(chain, js);
    });

});
