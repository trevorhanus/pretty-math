import { expect } from 'chai';
import { Block, LeftParensBlock, RightParensBlock } from 'pretty-math/internal';

describe('RightParensBlock', () => {

    it('find left parens partner', () => {
        const rp = new RightParensBlock(')');
        expect(rp.leftParensPartner).to.eq(null);

        const lp = new LeftParensBlock('(');
        rp.insertChainLeft(lp);
        expect(rp.leftParensPartner).to.eq(lp);

        const a = new Block('a');
        rp.insertChainLeft(a);
        expect(rp.leftParensPartner).to.eq(lp);
    });
});
