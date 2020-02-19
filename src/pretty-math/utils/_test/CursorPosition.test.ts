import { expect } from 'chai';
import { BlockBuilder, BlockType, CursorPosition, RadicalBlock } from 'pretty-math/internal';

describe('CursorPosition', () => {

    it('position', () => {
        const sqrt = BlockBuilder.fromJS({
            type: BlockType.Radical,
            inner: [
                { type: BlockType.Block, text: 'a' },
                { type: BlockType.Block, text: 'b' },
            ],
        }) as RadicalBlock;
        const a = sqrt.inner;
        const b = a.right;

    });

    describe('isLeftOf', () => {

        it('works', () => {
            const x = BlockBuilder.fromJS([
                { type: BlockType.Block, text: 'x' },
                { type: BlockType.Block, text: '=' },
                {
                    type: BlockType.Radical,
                    inner: [
                        { type: BlockType.Block, text: 'a' },
                    ]
                },
            ]);
            const equals = x.right;
            const sqrt = equals.right;
            const a = (sqrt as RadicalBlock).inner;

            const xLeft = new CursorPosition(x, 0);
            const xRight = new CursorPosition(x, 1);
            const sqLeft = new CursorPosition(sqrt, 0);
            const sqRight = new CursorPosition(sqrt, 1);
            const aLeft = new CursorPosition(a, 0);
            const aRight = new CursorPosition(a, 1);

            expect(xLeft.isLeftOf(sqLeft)).to.eq(true);
            expect(xLeft.isLeftOf(aLeft)).to.eq(true);
            expect(xRight.isLeftOf(aLeft)).to.eq(true);
            expect(sqLeft.isLeftOf(aLeft)).to.eq(true);
            expect(sqLeft.isLeftOf(aRight)).to.eq(true);
            expect(sqLeft.isLeftOf(sqRight)).to.eq(true);
        });

    });
});
