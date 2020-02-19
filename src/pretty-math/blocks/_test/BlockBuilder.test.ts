import { expect } from 'chai';
import { chainEquals } from 'pretty-math/blocks/_test/testutils';
import { Block, BlockType } from 'pretty-math/internal';
import * as BlockBuilder2 from '../BlockBuilder';

describe('BlockBuilder', () => {

    it('reduceChains: empty', () => {
        expect(BlockBuilder2.reduceChains([])).to.eq(null);
    });

    it('reduceChains: single block', () => {
        const b = new Block('a');
        expect(BlockBuilder2.reduceChains([b])).to.eq(b);
    });

    it('reduceChains: multiple blocks', () => {
        const a = new Block('a');
        const b = new Block('b');
        const reduced = BlockBuilder2.reduceChains([a, b]);
        expect(reduced).to.eq(a);
        const js = [
            {
                type: BlockType.Block,
                text: 'a',
            },
            {
                type: BlockType.Block,
                text: 'b',
            }
        ];

        chainEquals(a, js);
    });

    it('reduceChains: some null', () => {
        const a = new Block('a');
        const b = new Block('b');
        const reduced = BlockBuilder2.reduceChains([a, null, b]);
        expect(reduced).to.eq(a);
        const js = [
            {
                type: BlockType.Block,
                text: 'a',
            },
            {
                type: BlockType.Block,
                text: 'b',
            }
        ];

        chainEquals(a, js);
    });

    it('reduceChains: some null', () => {
        const a = new Block('a');
        const reduced = BlockBuilder2.reduceChains([null, null, a]);
        expect(reduced).to.eq(a);
        const js = [
            {
                type: BlockType.Block,
                text: 'a',
            },
        ];

        chainEquals(a, js);
    });

    it('buildSupSub', () => {
        const i = new Block('i');
        const ss = BlockBuilder2.buildSupSub(null, i);
        const js = [
            {
                type: BlockType.SupSub,
                sub: [
                    {
                        type: BlockType.Block,
                        text: 'i',
                    }
                ]
            }
        ];
        chainEquals(ss, js);
    });

    it('buildSupSub with hex', () => {
        const hexChain = BlockBuilder2.chainFromString('x007b0061007d');
        // {a} <= decoded hex

        const ss = BlockBuilder2.buildSupSub(null, hexChain);

        const js = [
            {
                type: BlockType.SupSub,
                sub: [
                    {
                        type: BlockType.Block,
                        text: 'a',
                    }
                ]
            }
        ];

        chainEquals(ss, js);
    });
});
