import { expect } from 'chai';
import { autorun } from 'mobx';
import { fillArray } from '~/core';
import {
    Block,
    BlockType,
    calchubFromChain,
    calchubOutputFromChain,
    FractionBlock,
    getStartIndexForBlock,
    IBlock,
    IBlockState
} from 'pretty-math/internal';

describe('FractionBlock', () => {
    
    it('setNum', () => {
        const f = new FractionBlock();
        const a = new Block('a');
        const blank = f.num;

        f.setNum(a);
        expect(blank.parent).to.eq(null);
        expect(a.parent).to.eq(f);
        expect(f.num).to.eq(a);
    });

    it('setDenom', () => {
        const f = new FractionBlock();
        const a = new Block('a');
        const blank = f.denom;

        f.setDenom(a);
        expect(blank.parent).to.eq(null);
        expect(a.parent).to.eq(f);
        expect(f.denom).to.eq(a);
    });

    it('toJS()', () => {
        const frac = new FractionBlock();
        expect(frac.toJSShallow()).to.deep.include({
            type: 'fraction',
            num: [
                {
                    id: frac.num.id,
                    type: 'blank',
                }
            ],
            denom: [
                {
                    id: frac.denom.id,
                    type: 'blank',
                }
            ]
        });

        const b1 = new Block('b1');
        frac.setNum(b1);
        expect(frac.toJSShallow()).to.deep.include({
            type: 'fraction',
            num: [
                {
                    id: b1.id,
                    type: 'block',
                    text: 'b1',
                },
            ],
            denom: [
                {
                    id: frac.denom.id,
                    type: 'blank',
                }
            ],
        });

        const b2 = new Block('b2');
        frac.setDenom(b2);
        expect(frac.toJSShallow()).to.deep.include({
            type: 'fraction',
            num: [
                {
                    id: b1.id,
                    type: 'block',
                    text: 'b1',
                },
            ],
            denom: [
            {
                id: b2.id,
                type: 'block',
                text: 'b2',
            },
        ]
        });
    });

    it('fromJS()', () => {
        const state: IBlockState = {
            type: BlockType.Fraction,
            num: [
                {
                    id: '1',
                    type: BlockType.Block,
                    text: 'b1',
                }
            ],
            denom: [
                {
                    id: '2',
                    type: BlockType.Block,
                    text: 'b2',
                },
            ]
        };

        const frac = FractionBlock.fromJS(state);
        expect(frac.toJSShallow()).to.deep.include(state);
    });

    it('getCalchubOutput', () => {
        const f = new FractionBlock();

        let text = '';
        let sm = [];
        autorun(() => {
            const output = calchubOutputFromChain(f);
            text = output.text;
            sm = output.sourceMap;
        });

        expect(text).to.eq('\\frac{,}');
        expect(sm).to.deep.eq(fillArray(8, f));

        const a = new Block('a');
        f.setNum(a);

        expect(text).to.eq('\\frac{a,}');
        expect(sm).to.deep.eq([
            ...fillArray(6, f),
            a,
            ...fillArray(2, f),
        ]);

        const frac2 = new FractionBlock();
        f.setDenom(frac2);

        expect(text).to.eq('\\frac{a,\\frac{,}}');
        expect(sm).to.deep.eq([
            ...fillArray(6, f),
            ...[a, f],
            ...fillArray(8, frac2),
            ...[f]
        ]);
    });

    it('getCalchubOutput: block to right', () => {
        const frac = new FractionBlock();
        expect(frac.toCalchub()).to.eq('\\frac{,}');

        const a = new Block('a');
        frac.insertChainRight(a);

        expect(calchubFromChain(frac)).to.eq('\\frac{,}a');
    });

    it('getCalchubOutput: with children 2', () => {
        const frac = new FractionBlock();
        const f = new Block('f');
        const times = new Block('*');
        const d = new Block('d');
        f.insertChainRight(times);
        times.insertChainRight(d);
        frac.setDenom(f);

        // \frac{,f*d}
        const { text, sourceMap } = calchubOutputFromChain(frac);
        expect(text).to.eq('\\frac{,f*d}');

        const starts = [
            [0, frac], // \
            [7, f], // f
            [8, times], // *
            [9, d]
        ];

        starts.forEach(test => {
            const [ index, block ] = test;
            expect(getStartIndexForBlock(block as IBlock, sourceMap)).to.eq(index);
        });
    });

    it('getCalchubOutput: with children 3', () => {
        const frac = new FractionBlock();
        const one = new Block('1');
        const two = new Block('2');
        const t = new Block('t');
        one.insertChainRight(two);
        frac.setNum(one);
        frac.setDenom(t);

        // \frac{12,t}
        const { text, sourceMap } = calchubOutputFromChain(frac);
        expect(text).to.eq('\\frac{12,t}');

        const starts = [
            [0, frac], // \
            [6, one], // 1
            [7, two], // 2
            [9, t]
        ];

        starts.forEach(test => {
            const [ index, block ] = test;
            expect(getStartIndexForBlock(block as IBlock, sourceMap)).to.eq(index);
        });
    });
});
