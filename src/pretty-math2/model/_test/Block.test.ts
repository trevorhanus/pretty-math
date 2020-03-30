import { expect } from 'chai';
import { BlockFactory } from "pretty-math2/blocks/BlockFactory";

describe('Block', () => {
    it('Block.clone', () => {
        const b = BlockFactory.createBlock('atomic', { text: 't' });
        const clone = b.clone();
        expect(b).is.not.eq(clone);
        expect(b.id).is.eq(clone.id);
        expect(b.toCalchub().text).is.eq(clone.toCalchub().text);
    });

    it('Block.deepClone', () => {
        const b = BlockFactory.createBlock('math:function', { displayValue: 'sin' });
        b.children['inner'].insertBlock(
            b.children['inner'].end,
            BlockFactory.createBlock('atomic', { text: 'x' }));
        const deepClone = b.deepClone();

        expect(b).is.not.eq(deepClone);
        expect(b.children['inner'].start.id).is.eq(deepClone.children['inner'].start.id);
    });

    it('Block.deepClone (super)', () => {
        const sin = BlockFactory.createBlock('math:function', { displayValue: 'sin' });
        const cos = BlockFactory.createBlock('math:function', { displayValue: 'cos' });
        sin.children['inner'].insertBlock(sin.children['inner'].end, cos);
        cos.children['inner'].insertBlock(
            cos.children['inner'].end,
            BlockFactory.createBlock('atomic', { text: 'x' })
        );
        const deepClone = sin.deepClone();
        expect(sin).is.not.eq(deepClone);
        expect(sin.children['inner'].start.children['inner'].start.id).is.eq(
            deepClone.children['inner'].start.children['inner'].start.id
        );
    });
});