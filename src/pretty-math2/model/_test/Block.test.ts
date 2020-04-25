import { expect } from 'chai';
import { BlockFactory } from "pretty-math2/blocks/BlockFactory";

describe('Block', () => {

    it('Block.clone', () => {
        const b = BlockFactory.createBlock('atomic', { text: 't' });
        const clone = b.clone();
        expect(b).is.not.eq(clone);
        expect(b.id).is.not.eq(clone.id);
        expect(b.data).to.deep.eq(clone.data);
        expect(b.toCalchub().text).is.eq(clone.toCalchub().text);
    });

    it('Block.deepClone', () => {
        const b = BlockFactory.createBlock('math:function', { displayValue: 'sin' });
        b.childMap['inner'].insertBlock(
            b.childMap['inner'].end,
            BlockFactory.createBlock('atomic', { text: 'x' })
        );
        const deepClone = b.deepClone();

        expect(b).is.not.eq(deepClone);
        expect(b.childMap['inner'].start.id).is.not.eq(deepClone.childMap['inner'].start.id);
    });

    it('Block.deepClone (super)', () => {
        const sin = BlockFactory.createBlock('math:function', { displayValue: 'sin' });
        const cos = BlockFactory.createBlock('math:function', { displayValue: 'cos' });
        sin.childMap['inner'].insertBlock(sin.childMap['inner'].end, cos);
        cos.childMap['inner'].insertBlock(
            cos.childMap['inner'].end,
            BlockFactory.createBlock('atomic', { text: 'x' })
        );
        const deepClone = sin.deepClone();
        expect(sin).is.not.eq(deepClone);
        expect(sin.childMap['inner'].start.childMap['inner'].start.id).is.not.eq(
            deepClone.childMap['inner'].start.childMap['inner'].start.id
        );
    });
});
