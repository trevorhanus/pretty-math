import { expect } from 'chai';
import { BlockBuilder, BlockType, calchubFromChain, RootBlock } from 'pretty-math/internal';

const { Block, Radical, RightParens, LeftParens, Function, Fraction, SupSub, Blank, DefineFunction, Derivative } = BlockType;

describe('BlockBuilder.fromJS', () => {

    it('simple blocks', () => {
        const s1 = {
            id: 'root',
            type: BlockType.Root,
            blocks: [
                {
                    id: '1',
                    type: Block,
                    text: 'x'
                },
                {
                    id: '2',
                    type: Block,
                    text: '+'
                },
                {
                    id: '3',
                    type: Block,
                    text: '2'
                }
            ]
        };

        const chain1 = BlockBuilder.fromJS(s1) as RootBlock;
        expect(chain1.toRootBlockJS()).to.deep.eq(s1);
        const chain2 = BlockBuilder.fromJS(s1) as RootBlock;
        expect(chain2.toRootBlockJS()).to.deep.eq(chain1.toRootBlockJS());
    });

    it('radical block', () => {
        const s1 = [
            {
                id: '1',
                type: Radical,
                latex: '\\sqrt',
                text: 'sqrt',
                inner: [
                    {
                        id: '2',
                        type: Block,
                        text: '2'
                    }
                ]
            }
        ];

        const chain1 = BlockBuilder.fromJS(s1);
        expect(chain1.toJS()).to.deep.eq(s1);
        const chain2 = BlockBuilder.fromJS(s1);
        expect(chain2.toJS()).to.deep.eq(chain1.toJS());
    });

    it('supsub, fraction, blank, function, left parens, right parens blocks', () => {
        const s1 = [
            {
                id: '1',
                type: SupSub,
                sup: [
                    {
                        id: '2',
                        type: Block,
                        text: '2'
                    }
                ],
                sub: [
                    {
                        id: '3',
                        type: Block,
                        text: '2'
                    }
                ],
            },
            {
                id: '4',
                type: Fraction,
                num: [
                    {
                        id: '5',
                        type: Block,
                        text: '2'
                    }
                ],
                denom: [
                    {
                        id: '6',
                        type: Block,
                        text: '2'
                    }
                ]
            },
            {
                id: '7',
                type: Blank
            },
            {
                id: '8',
                type: Function,
                latex: '\\sin',
                text: 'sin',
                inner: [
                    {
                        id: '9',
                        type: Block,
                        text: '2'
                    }
                ]
            },
            {
                id: '10',
                type: LeftParens,
                text: '('
            },
            {
                id: '11',
                type: RightParens,
                text: ')'
            }
        ];

        const chain1 = BlockBuilder.fromJS(s1);
        expect(chain1.toJS()).to.deep.eq(s1);
        const chain2 = BlockBuilder.fromJS(s1);
        expect(chain2.toJS()).to.deep.eq(chain1.toJS());
    });

    it ('simple', () => {
        [
            {
                js: [
                    {
                        type: DefineFunction,
                        latex: '\\dfunc',
                        funcName: [
                            {
                                type: Block,
                                text: 'f'
                            },
                        ],
                        inner: [
                            {
                                type: Block,
                                text: 'x'
                            },
                        ]
                    },
                ],
                calchub: '\\dfunc{f,x}',
            },
        ].forEach(test => {
            const { js, calchub } = test;
            const chain = BlockBuilder.fromJS(js);
            expect(chain.toShorthand()[0], `shorthand: ${calchub}`).to.deep.include(js[0]);
            expect(calchubFromChain(chain), `text: ${calchub}`).to.eq(calchub);
        });
    });

});
