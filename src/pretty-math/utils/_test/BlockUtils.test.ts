import { expect } from 'chai';
import {
    BlockUtils,
    buildChainFromCalchub,
    DerivativeBlock,
    DifferentialBlock,
} from 'pretty-math/internal';

describe('BlockUtils', () => {

    describe('removeRange', () => {

        // it('collapsed range', () => {
        //     const root = new RootBlock();
        //     const chain = BlockBuilder.fromText('abc');
        //     root.setStartBlock(chain);

        //     const collapsed = Range.create({ block: chain, offset: 1 }, { block: chain, offset: 1 });

        //     const pos = BlockUtils.removeRange(collapsed);
        //     expect(pos).to.eq(null);
        // });

        // it('whole chain', () => {
        //     const root = new RootBlock();
        //     const chain = BlockBuilder.fromText('abc');
        //     root.setStartBlock(chain);

        //     const wholeChain = Range.create({ block: chain, offset: 0 }, { block: chain.chainEnd, offset: 1 });

        //     const pos = BlockUtils.removeRange(wholeChain);
        //     expect(pos.block).to.eq(root.chainStart);
        //     expect(pos.block.type).to.eq(BlockType.Blank);
        // });

        // it('one block', () => {
        //     const root = new RootBlock();
        //     const a = BlockBuilder.fromText('abc');
        //     const b = a.right;
        //     const c = b.right;
        //     root.setStartBlock(a);

        //     const wholeChain = Range.create({ block: a, offset: 1 }, { block: c, offset: 0 });

        //     const pos = BlockUtils.removeRange(wholeChain);
        //     expect(pos).to.deep.eq({ block: a, offset: 1 });
        // });

        // it('one block', () => {
        //     const root = new RootBlock();
        //     const a = BlockBuilder.fromText('abc');
        //     const b = a.right;
        //     root.setStartBlock(a);

        //     const wholeChain = Range.create({ block: b, offset: 0 }, { block: b, offset: 1 });

        //     const pos = BlockUtils.removeRange(wholeChain);
        //     expect(pos).to.deep.eq({ block: a, offset: 1 });
        // });

        // it('two end blocks', () => {
        //     const root = new RootBlock();
        //     const a = BlockBuilder.fromText('abc');
        //     const b = a.right;
        //     const c = b.right;
        //     root.setStartBlock(a);

        //     const wholeChain = Range.create({ block: b, offset: 0 }, { block: c, offset: 1 });
        //     const pos = BlockUtils.removeRange(wholeChain);

        //     expect(root.toLatex()).to.eq('a');
        // });

        // it('two start blocks', () => {
        //     const root = new RootBlock();
        //     const a = BlockBuilder.fromText('abcd');
        //     const b = a.right;
        //     const c = b.right;
        //     const d = c.right;
        //     root.setStartBlock(a);

        //     const range = Range.create({ block: a, offset: 0 }, { block: b, offset: 1 });
        //     BlockUtils.removeRange(range);
        //     expect(root.toLatex()).to.eq('cd');
        // });

        // it('range in denominator', () => {
        //     const frac = BlockBuilder.fromText('1/ab') as FractionBlock;
        //     const a = frac.denom;
        //     const b = a.right;
        //     const range = Range.create({ block: a, offset: 0 }, { block: b, offset: 1 });
        //     const nextPos = BlockUtils.removeRange(range);
        //     expect(frac.denom.type).to.eq(BlockType.Blank);
        // });
    });
});
