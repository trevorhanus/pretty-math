import { expect } from 'chai';
import {
    Block,
    BlockBuilder,
    BlockType,
    buildChainFromCalchub,
    CursorPosition,
    FractionBlock,
    RadicalBlock,
    Range
} from 'pretty-math/internal';

describe('Range', () => {

    it('includes', () => {
        const y = buildChainFromCalchub('foo');
        const r1 = Range.create({ block: y, offset: 0 }, { block: y, offset: 3 });
        const r2 = Range.create({ block: y, offset: 1 }, { block: y, offset: 2 });
        expect(r1.includes(r2)).to.be.true;
    });

    it('anchor high, focus low', () => {
        const sqrt = BlockBuilder.fromJS({
            type: BlockType.Radical,
            inner: [
                { type: BlockType.Block, text: 'a' }
            ],
        });
        const a = (sqrt as RadicalBlock).inner;

        const r1 = new Range();
        r1.setAnchor({ block: sqrt, offset: 1 });
        r1.setFocus({ block: a, offset: 1 });

        expect(r1.start.toJS()).to.deep.eq({ block: a, offset: 1 });
        expect(r1.end.toJS()).to.deep.eq({ block: sqrt, offset: 1 });
    });

    it('anchor high, focus low', () => {
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

        const r1 = new Range();
        r1.setAnchor({ block: x, offset: 1 });
        r1.setFocus({ block: a, offset: 0 });

        expect(r1.start.toJS()).to.deep.eq({ block: x, offset: 1 });
        expect(r1.end.toJS()).to.deep.eq({ block: a, offset: 0 });
    });

    it('set focus with no anchor anchors at that position', () => {
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

        const r1 = new Range();
        r1.setFocus({ block: a, offset: 0 });

        expect(r1.start.toJS()).to.deep.eq({ block: a, offset: 0 });
        expect(r1.end.toJS()).to.deep.eq({ block: a, offset: 0 });
    });

    it('attempt to focus a block not in the same chain as the anchor ', () => {
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

        const r1 = new Range();
        r1.setAnchor({ block: a, offset: 0 });

        expect(r1.start.toJS()).to.deep.eq({ block: a, offset: 0 });
        expect(r1.end.toJS()).to.deep.eq({ block: a, offset: 0 });

        const b = new Block('b');
        r1.setFocus({ block: b, offset: 1 });

        expect(r1.start.toJS()).to.deep.eq({ block: a, offset: 0 });
        expect(r1.end.toJS()).to.deep.eq({ block: a, offset: 0 });
    });

    it('anchor high, focus low', () => {
        const sqrt = BlockBuilder.fromJS({
            type: BlockType.Radical,
            inner: [
                { type: BlockType.Block, text: 'a' },
                { type: BlockType.Block, text: 'b' },
            ],
        }) as RadicalBlock;
        const a = sqrt.inner;
        const b = a.right;

        const anchor = new CursorPosition(sqrt, 1);
        const focus = new CursorPosition(b, 1);

        const range = Range.create(anchor, focus);

        expect(range.start.toJS()).to.deep.eq({ block: b, offset: 1 });
        expect(range.end.toJS()).to.deep.eq({ block: sqrt, offset: 1 });
    });

    it('with fraction', () => {
        const frac = buildChainFromCalchub('\\frac{10,2}') as FractionBlock;
        const one = frac.num;
        const two = frac.denom;

        const range = Range.create({ block: frac, offset: 1 }, { block: one, offset: 1 });

        expect(range.start.toJS()).to.deep.eq({ block: one, offset: 1 });
        expect(range.end.toJS()).to.deep.eq({ block: frac, offset: 1 });
    });
});
