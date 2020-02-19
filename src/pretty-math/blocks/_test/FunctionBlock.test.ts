import { expect } from 'chai';
import { fillArray } from '~/core';
import { Block, BlockType, calchubFromChain, calchubOutputFromChain, FunctionBlock, RadicalBlock } from 'pretty-math/internal';

describe('FunctionBlock', () => {

    it('creation', () => {
        const sin = new FunctionBlock('sin', '\\sin');
        expect(sin.inner.type).to.eq(BlockType.Blank);
        expect(sin.text).to.eq('sin');
        expect(sin.toCalchub()).to.eq('\\sin{()}');
    });

    it('getCalchubOutput: with inner', () => {
        const f = new FunctionBlock('a', '\\a');
        const inner = new Block('b');
        f.setInner(inner);
        // \a{(b)}

        const { text, sourceMap } = calchubOutputFromChain(f);
        expect(text).to.eq('\\a{(b)}');
        expect(sourceMap).to.deep.eq([
            ...fillArray(4, f),
            ...[inner],
            ...fillArray(2, f),
        ]);
    });

    it('contains', () => {
        const x = new Block('x');
        const r = new RadicalBlock();
        const a = new Block('a');
        x.insertChainRight(r);
        r.setInner(a);
        expect(x.contains(a)).to.be.true;
    });

    it('getCalchubOutput', () => {
        const rb = new FunctionBlock('foo', '\\bar');
        expect(calchubFromChain(rb)).to.eq('\\bar{()}');

        const b = new Block('b');
        rb.setInner(b);

        const { text } = calchubOutputFromChain(rb);
        expect(text).to.eq('\\bar{(b)}');
    });

    it('toJS()', () => {
        const rb = new FunctionBlock('b', 'foo');
        expect(rb.toJS()).to.deep.eq([
            {
                id: rb.id,
                type: BlockType.Function,
                text: 'b',
                latex: 'foo',
                inner: [
                    {
                        id: rb.inner.id,
                        type: BlockType.Blank,
                    }
                ]
            }
        ]);
    });

    it('fromJS()', () => {
        const state = {
            type: BlockType.Function,
            latex: '\\sin',
            inner: [
                {
                    type: BlockType.Block,
                    text: '1'
                }
            ],
        };
        const r = FunctionBlock.fromJS(state);
        // expect(r.toJS()).to.deep.eq([state]);
    });
});
