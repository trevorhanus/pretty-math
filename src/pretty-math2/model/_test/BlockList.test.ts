import { expect } from 'chai';
import { BlockList } from '../BlockList';

describe('BlockList', () => {

    describe('creation', () => {

        it('cannot be null', () => {
            const name = 'foo';
            const config = {
                canBeNull: false,
                order: 0,
            };
            const list = new BlockList(null, name, config);
            expect(list.length).to.eq(1);
            expect(list.getBlock(0).type).to.eq('end');
            expect(list.isEmpty).to.eq(false);
            expect(list.isOnlyEndBlock).to.eq(true);

        });
    });

});
