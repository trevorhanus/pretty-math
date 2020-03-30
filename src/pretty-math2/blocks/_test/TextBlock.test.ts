import { expect } from 'chai';
import { Block } from '../../model';
import { BlockFactory } from '../BlockFactory';

describe('TextBlock', () => {

    it('works', () => {
        const block = BlockFactory.createBlock('atomic', { text: 'a' });

        expect(block.data.text).to.eq('a');
        expect(block.toCalchub().text).to.eq('a');
    });
});
