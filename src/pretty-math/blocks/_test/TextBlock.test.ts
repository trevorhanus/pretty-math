import { expect } from 'chai';
import { BlockFactory } from 'pretty-math/internal';

describe('TextBlock', () => {

    it('works', () => {
        const block = BlockFactory.createBlock('atomic', { text: 'a' });

        expect(block.data.text).to.eq('a');
        expect(block.toCalchub().text).to.eq('a');
    });
});
