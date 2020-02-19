import { expect } from 'chai';
import { Block, BlockType, LeftParensBlock, RightParensBlock } from 'pretty-math/internal';

describe('LeftParensBlock', () => {

    it('find right parens partner', () => {
        const lp = new LeftParensBlock('(');
        expect(lp.rightParensPartner).to.eq(null);

        const rp = new RightParensBlock(')');
        lp.insertChainRight(rp);
        expect(lp.rightParensPartner).to.eq(rp);

        const a = new Block('a');
        lp.insertChainRight(a);
        expect(lp.rightParensPartner).to.eq(rp);

        const rp2 = new RightParensBlock(')');
        a.insertChainRight(rp2);
        expect(lp.rightParensPartner).to.eq(rp2);
    });

    it('discern between parens types', () => {
        const lp = new LeftParensBlock('(');
        expect(lp.rightParensPartner).to.eq(null);

        const rp = new RightParensBlock('}');
        lp.insertChainRight(rp);
        expect(lp.rightParensPartner).to.eq(null);

        const rp2 = new RightParensBlock(')');
        rp.insertChainRight(rp2);
        expect(lp.rightParensPartner).to.eq(rp2);
    });

    it('has a random color', () => {
        const lp = new LeftParensBlock(')');
        expect(lp.rgbColor).to.be.ok;
    });

    it('toJS()', () => {
        const lp = new LeftParensBlock('(');
        const rp = new RightParensBlock(')');
        lp.insertChainRight(rp);
        expect(lp.toJS()).to.deep.eq([
            { id: lp.id, type: BlockType.LeftParens, text: '(' },
            { id: rp.id, type: BlockType.RightParens, text: ')' }
        ]);
    });

    it('toJS() curly', () => {
        const lp = new LeftParensBlock('{', '\\{');
        const rp = new RightParensBlock('}', '\\}');
        lp.insertChainRight(rp);
        expect(lp.toJS()).to.deep.eq([
            { id: lp.id, type: BlockType.LeftParens, text: '{', latex: '\\{' },
            { id: rp.id, type: BlockType.RightParens, text: '}', latex: '\\}' }
        ]);
    });

    it('fromJS()', () => {
        const js = {
            type: BlockType.LeftParens,
            text: '[',
        };

        const block = LeftParensBlock.fromJS(js);
        expect(block.text).to.eq('[');
    });
});
