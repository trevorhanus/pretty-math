import { expect } from 'chai';
import { Block } from '../../model';

describe('TextBlock', () => {

    it('works', () => {
        const block = Block.fromJS({
            type: 'atomic',
            data: {
                text: 'a',
            }
        });

        expect(block.data.text).to.eq('a');
        expect(block.toCalchub().text).to.eq('a');
    });
});
