import { expect } from 'chai';
import { fillArray } from '~/core';
import { Block, BlockType, calchubOutputFromChain, DifferentialBlock, PartialDifferentialBlock } from 'pretty-math/internal';

describe('DifferentialBlock', () => {
    
    it('differential fromJS', () => {
        const js = {
            id: 'foo',
            type: BlockType.Differential,
            latex: '\\wrt',
            text: 'd',
            inner: [
                {
                    id: 'bar',
                    type: BlockType.Block,
                    text: 'a',
                }
            ]
        };
        
        const wrt = DifferentialBlock.fromJS(js);
        expect(wrt.toJS()[0]).to.deep.eq(js);
    });

    it('partial differential fromJS', () => {
        const js = {
            id: 'foo',
            type: BlockType.Differential,
            latex: '\\pwrt',
            text: '∂',
            inner: [
                {
                    id: 'bar',
                    type: BlockType.Block,
                    text: 'x',
                }
            ]
        };

        const wrt = DifferentialBlock.fromJS(js);
        expect(wrt.toJS()[0]).to.deep.eq(js);
    });

    it('getCalchubOutput: Differential', () => {
        const d = new DifferentialBlock();
        const b = new Block('b');
        d.setInner(b);

        const { text, sourceMap } = calchubOutputFromChain(d);
        expect(text).to.eq('\\wrt{b}');
        expect(sourceMap).to.deep.eq([
            ...fillArray(5, d),
            ...[b, d],
        ]);
    });

    it('getCalchubOutput: Partial', () => {
        const d = new PartialDifferentialBlock();
        const b = new Block('b');
        d.setInner(b);

        const { text, sourceMap } = calchubOutputFromChain(d);
        expect(text).to.eq('\\pwrt{b}');
        expect(sourceMap).to.deep.eq([
            ...fillArray(6, d),
            ...[b, d],
        ]);
    });
});
