import { expect } from 'chai';
import { generateId } from '~/core/utils/utils';

describe('Utils', () => {

    it('generateId', () => {
        const id = generateId();
        expect(id).to.be.a('string');
    });
});
