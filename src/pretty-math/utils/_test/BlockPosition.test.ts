import { expect } from 'chai';
import { BlockBuilder, BlockType, getBlockAtPosition, IBlock, RadicalBlock } from 'pretty-math/internal';
import { BlockPosition } from 'pretty-math/utils/BlockPosition';

describe('BlockPosition', () => {

    it('increment', () => {
        let pos = new BlockPosition([], 0);

        expect(pos.toString()).to.eq('0');

        pos = pos.incLevel(1);
        expect(pos.toString()).to.eq('0.1:0');

        pos = pos.incIndex();
        expect(pos.toString()).to.eq('0.1:1');

        pos = pos.incLevel(2);
        expect(pos.toString()).to.eq('0.1:1.2:0');
    });

    it('makes copies of path', () => {
        const p1 = new BlockPosition([], 0);
        const p2 = p1.incIndex();
        expect(p1.path).to.not.eq(p2.path);
    });

    describe('isBelow', () => {

        it('direct parent', () => {
            const parent = BlockPosition.fromString('0');
            const child = BlockPosition.fromString('0.1:0');
            expect(child.isBelow(parent)).to.eq(true);
            expect(parent.isBelow(child)).to.eq(false);
        });

        it('top is depth 0', () => {
            const parent = BlockPosition.fromString('0');
            const child = BlockPosition.fromString('2.1:0');
            expect(child.isBelow(parent)).to.eq(false);
            expect(parent.isBelow(child)).to.eq(false);
        });

        it('at a greater depth, but different parent', () => {
            const p1 = BlockPosition.fromString('0.1:4');
            const p2 = BlockPosition.fromString('0.2:0.1:5');
            expect(p1.isBelow(p2)).to.eq(false);
            expect(p2.isBelow(p1)).to.eq(false);
        });

        it('far up tree', () => {
            const p1 = BlockPosition.fromString('0.1:0');
            const p2 = BlockPosition.fromString('0.1:0.2:4.3:6');
            expect(p1.isBelow(p2)).to.eq(false);
            expect(p2.isBelow(p1)).to.eq(true);
        });

    });

    describe('isLeftOf', () => {

        it('when position is below', () => {
            // if the position is below, then it's not
            // really to the left or the right
            const p1 = BlockPosition.fromString('0.1:0');
            const p2 = BlockPosition.fromString('0.1:0.2:4.3:6');
            expect(p1.isLeftOf(p2)).to.eq(false);
        });

        it('when position is below but not in the same lineage', () => {
            // if the position is below, then it's not
            // really to the left or the right
            const p1 = BlockPosition.fromString('0.1:0');
            const p2 = BlockPosition.fromString('0.1:1.2:4.3:6');
            expect(p1.isLeftOf(p2)).to.eq(true);
            expect(p2.isLeftOf(p1)).to.eq(false);
        });

        it('at top level', () => {
            // if the position is below, then it's not
            // really to the left or the right
            const p1 = BlockPosition.fromString('0');
            const p2 = BlockPosition.fromString('3');
            expect(p1.isLeftOf(p2)).to.eq(true);
            expect(p2.isLeftOf(p1)).to.eq(false);
        });

        it('at same nested level', () => {
            // if the position is below, then it's not
            // really to the left or the right
            const p1 = BlockPosition.fromString('0.1:3.4:2');
            const p2 = BlockPosition.fromString('0.1:3.4:4');
            expect(p1.isLeftOf(p2)).to.eq(true);
            expect(p2.isLeftOf(p1)).to.eq(false);
        });

    });

    describe('isRightOf', () => {

        it('when position is below', () => {
            // if the position is below, then it's not
            // really to the left or the right
            const p1 = BlockPosition.fromString('0.1:0');
            const p2 = BlockPosition.fromString('0.1:0.2:4.3:6');
            expect(p1.isRightOf(p2)).to.eq(false);
        });

        it('when position is below but not in the same lineage', () => {
            // if the position is below, then it's not
            // really to the left or the right
            const p1 = BlockPosition.fromString('0.1:0');
            const p2 = BlockPosition.fromString('0.1:1.2:4.3:6');
            expect(p1.isRightOf(p2)).to.eq(false);
            expect(p2.isRightOf(p1)).to.eq(true);
        });

        it('at top level', () => {
            // if the position is below, then it's not
            // really to the left or the right
            const p1 = BlockPosition.fromString('0');
            const p2 = BlockPosition.fromString('3');
            expect(p1.isRightOf(p2)).to.eq(false);
            expect(p2.isRightOf(p1)).to.eq(true);
        });

        it('at same nested level', () => {
            // if the position is below, then it's not
            // really to the left or the right
            const p1 = BlockPosition.fromString('0.1:3.4:2');
            const p2 = BlockPosition.fromString('0.1:3.4:4');
            expect(p1.isRightOf(p2)).to.eq(false);
            expect(p2.isRightOf(p1)).to.eq(true);
        });

    });

    it('in sqrt', () => {
        const sqrt = BlockBuilder.fromJS({
            type: BlockType.Radical,
            inner: [
                { type: BlockType.Block, text: 'a' },
                { type: BlockType.Block, text: 'b' },
            ],
        }) as RadicalBlock;
        const a = sqrt.inner;
        const b = a.right;

        // \sqrt{ab}

        expect(sqrt.position.toString()).to.eq('0');
        expect(a.position.toString()).to.eq('0.1:0');
        expect(b.position.toString()).to.eq('0.1:1');
    });

    it('getBlockAtPosition - radical', () => {
        const tree = BlockBuilder.fromJS({
            type: BlockType.Radical,
            inner: [
                { type: BlockType.Block, text: 'a' },
                { type: BlockType.Block, text: 'b' },
            ],
        });

        [
            {
                pos: '0',
                check: (block: IBlock) => {
                    expect(block.type).to.eq(BlockType.Radical);
                }
            },
            {
                pos: '0.1:0',
                check: (block: IBlock) => {
                    expect(block.text).to.eq('a');
                }
            },
            {
                pos: '0.1:1',
                check: (block: IBlock) => {
                    expect(block.text).to.eq('b');
                }
            }
        ].forEach(test => {
            const block = getBlockAtPosition(tree, test.pos);
            test.check(block);
        });
    });

});
