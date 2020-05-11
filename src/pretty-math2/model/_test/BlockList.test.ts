import { expect } from 'chai';
import { BlockList } from 'pretty-math2/internal';

describe('BlockList', () => {

    describe('creation', () => {

        it('cannot be null', () => {
            const name = 'foo';
            const config = {
                canBeNull: false,
                childNumber: 0,
            };
            const list = new BlockList(null, name, config);
            expect(list.length).to.eq(1);
            expect(list.getBlock(0).type).to.eq('end');
            expect(list.isNull).to.eq(false);
            expect(list.isEmpty).to.eq(true);

        });
    });

});
