import { expect } from 'chai';
import { Block, BlockType, RootBlock } from 'pretty-math/internal';

describe('RootBlock', () => {

    it('replaceChild', () => {
        const root = new RootBlock(null);
        const c1 = new Block('c1');
        const c2 = new Block('c2');

        root.setStartBlock(c1);
        expect(root.toCalchub()).to.eq('c1');
        root.replaceChild(c1, c2);
        expect(root.toCalchub()).to.eq('c2');
    });

    it('getCalchubOutput: with Radical', () => {
        const state = {
            type: BlockType.Root,
            blocks: [
                {
                    type: BlockType.Radical,
                    latex: '\\sqrt',
                    inner: [
                        {
                            type: BlockType.Block,
                            text: 'a',
                        }
                    ]
                }
            ]
        };
        const root = RootBlock.fromJS(state);
        expect(root.toCalchub()).to.eq('\\sqrt{a}');
    });

    it('toJS()', () => {
        const root = new RootBlock(null);
        expect(root.toRootBlockJS()).to.deep.eq(
            {
                id: root.id,
                type: BlockType.Root,
                blocks: [
                    {
                        id: root.chainStart.id,
                        type: BlockType.Blank
                    }
                ]
            }
        );

        const b = new Block('b');
        root.setStartBlock(b);
        expect(root.toRootBlockJS()).to.deep.eq(
            {
                id: root.id,
                type: BlockType.Root,
                blocks: [
                    {
                        id: b.id,
                        type: BlockType.Block,
                        text: 'b',
                    }
                ]
            }
        );
    });

    it('fromJS()', () => {
        const js = {
            type: BlockType.Root,
            blocks: [
                {
                    type: BlockType.Block,
                    text: 'b',
                }
            ]
        };
        const b = RootBlock.fromJS(js);
        // expect(b.toJS()).to.deep.eq(js);
    });
});
