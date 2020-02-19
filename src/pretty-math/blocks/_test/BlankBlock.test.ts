import { expect } from 'chai';
import { BlankBlock, Block, BlockType, calchubOutputFromChain, RadicalBlock } from 'pretty-math/internal';

describe('BlankBlock', () => {

    it('insertChainRight replaces the block', () => {
        const parent = new RadicalBlock();
        const blank = new BlankBlock();
        parent.setInner(blank);

        const s = new Block('s');
        blank.insertChainRight(s);

        expect(s.parent).to.eq(parent);
    });

    it('toJSShallow()', () => {
        const b = new BlankBlock();
        expect(b.toJSShallow()).to.deep.eq({ id: b.id, type: BlockType.Blank });
    });

    it('toJS()', () => {
        const b = new BlankBlock();
        expect(b.toJS()).to.deep.eq([
            { id: b.id, type: BlockType.Blank }
        ]);
    });

    it('getCalchubOutput: end of chain', () => {
        const a = new Block('a');
        const b = new BlankBlock();
        a.insertChainRight(b);

        const output = calchubOutputFromChain(a);
        expect(output.segments.length).to.eq(2);
        expect(output.text).to.eq('a');
        expect(output.sourceMap).to.deep.eq([a]);
    });

    it('getCalchubOutput: in middle of chain', () => {
        const a = new Block('a');
        const b = new BlankBlock();
        const c = new Block('c');
        a.insertChainRight(b);
        b.insertChainRight(c);

        const output = calchubOutputFromChain(a);
        expect(output.text).to.eq('ac');
        expect(output.sourceMap).to.deep.eq([a, c]);
    });
});
