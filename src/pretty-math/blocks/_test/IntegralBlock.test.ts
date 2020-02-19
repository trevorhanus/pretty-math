import { expect } from 'chai';
import { Block, buildChainFromCalchub, calchubOutputFromChain, IBlock, IntegralBlock } from 'pretty-math/internal';
import { getStartIndexForBlock } from 'pretty-math/utils';

describe('IntegralBlock', () => {

    it('getCalchubOutput: with bounds', () => {
        const int = new IntegralBlock();
        const inner = buildChainFromCalchub('x^2');
        const wrt = buildChainFromCalchub('x');
        const leftBound = buildChainFromCalchub('-1');
        const rightBound = buildChainFromCalchub('1');
        int.setInner(inner);
        int.setWrt(wrt);
        int.setLeftBound(leftBound);
        int.setRightBound(rightBound);
        const block = new Block('f');
        int.insertChainRight(block);

        // \int{x^{2},x,-1,1}f
        const { text, sourceMap } = calchubOutputFromChain(int);

        expect(text).to.eq('\\int{x^{2},x,-1,1}f');

        const starts = [
            [0, int],
            [5, inner],
            [11, wrt],
            [13, leftBound],
            [16, rightBound],
            [18, block],
        ];

        starts.forEach(test => {
            const [ index, block ] = test;
            expect(getStartIndexForBlock(block as IBlock, sourceMap)).to.eq(index);
        });
    });

    it('getCalchubOutput: without bounds', () => {
        const int = new IntegralBlock();
        const inner = buildChainFromCalchub('x^2');
        const wrt = buildChainFromCalchub('x');
        int.setInner(inner);
        int.setWrt(wrt);

        // \int{x^{2},x}
        const { text, sourceMap } = calchubOutputFromChain(int);

        expect(text).to.eq('\\int{x^{2},x}');

        const starts = [
            [0, int],
            [5, inner],
            [11, wrt],
        ];

        starts.forEach(test => {
            const [ index, block ] = test;
            expect(getStartIndexForBlock(block as IBlock, sourceMap)).to.eq(index);
        });
    });
});
