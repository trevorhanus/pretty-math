import { expect } from 'chai';
import {
    BlankBlock,
    buildChainFromCalchub,
    calchubOutputFromChain,
    DerivativeBlock,
    getStartIndexForBlock,
    IBlock
} from 'pretty-math/internal';

describe('DerivativeBlock', () => {

    it('creation', () => {
        const d = new DerivativeBlock();
        expect(d.wrt).to.be.an.instanceOf(BlankBlock);
        expect(d.inner).to.be.an.instanceOf(BlankBlock);
        expect(d.children).to.deep.eq([d.wrt, d.inner]);
        expect(d.isComposite).to.be.true;
    });

    it('setInner, setWrt', () => {
        const d = new DerivativeBlock();
        const inner = buildChainFromCalchub('x + 1');
        const wrt = buildChainFromCalchub('\\wrt{x}');
        d.setInner(inner);
        d.setWrt(wrt);

        expect(d.inner).to.eq(inner);
        expect(d.wrt).to.eq(wrt);
        expect(inner.parent).to.eq(d);
        expect(wrt.parent).to.eq(d);
    });

    it('getCalchubOutput', () => {
        const d = new DerivativeBlock();
        const inner = buildChainFromCalchub('x + 1');
        const wrt = buildChainFromCalchub('\\wrt{x}');
        d.setInner(inner);
        d.setWrt(wrt);

        // \diff{x+1,\wrt{x}}
        const { text, sourceMap } = calchubOutputFromChain(d);
        expect(text).to.eq('\\diff{x+1,\\wrt{x}}');

        // \diff{x+1,\wrt{x}}
        // 012345678901234567
        const starts = [
            [0, d],
            [6, inner],
            [10, wrt],
        ];

        starts.forEach(test => {
            const [ index, block ] = test;
            expect(getStartIndexForBlock(block as IBlock, sourceMap)).to.eq(index);
        });
    });

    it('position', () => {
        const d = new DerivativeBlock();
        const inner = buildChainFromCalchub('x + 1');
        const wrt = buildChainFromCalchub('\\wrt{x}');
        d.setInner(inner);
        d.setWrt(wrt);

        expect(d.position.toString()).to.eq('0');
        expect(inner.position.toString()).to.eq('0.2:0');
        expect(wrt.position.toString()).to.eq('0.1:0');
    });
});
