import { expect } from 'chai';
import { autorun } from 'mobx';
import { Block, BlockList } from '..';

describe('BlockList', () => {

    it('empty', () => {
        const list = new BlockList();
        expect(list.blocks.length).to.eq(0);
        expect(list.start).to.eq(null);
        expect(list.end).to.eq(null);
    });

    it('populated', () => {
        const b1 = new Block({ id: 'b1', type: 'foo' });
        const b2 = new Block({ id: 'b2', type: 'foo' });
        const b3 = new Block({ id: 'b3', type: 'foo' });
        const list = new BlockList([b1, b2, b3]);
        expect(list.length).to.eq(3);
        expect(list.start).to.eq(b1);
        expect(list.end).to.eq(b3);
        expect(list.getIndex(b1)).to.eq(0);
        expect(list.getIndex(b2)).to.eq(1);
        expect(list.getIndex(b3)).to.eq(2);
    });

    it('insert', () => {
        const b1 = new Block({ id: 'b1', type: 'foo' });
        const b2 = new Block({ id: 'b2', type: 'foo' });
        const b3 = new Block({ id: 'b3', type: 'foo' });

        const list = new BlockList([b1, b2, b3]);

        expect(b1.list).to.eq(list);

        expect(list.length).to.eq(3);
        expect(list.start).to.eq(b1);
        expect(list.end).to.eq(b3);

        const b0 = new Block({ id: 'b0', type: 'foo' });
        list.splice(0, 0, b0);

        expect(list.length).to.eq(4);
        expect(list.start).to.eq(b0);
        expect(list.end).to.eq(b3);
        expect(list.getIndex(b0)).to.eq(0);

        expect(list.next(b0)).to.eq(b1);
    });

    it('next and prev', () => {
        const b1 = new Block({ id: 'b1', type: 'foo' });
        const b2 = new Block({ id: 'b2', type: 'foo' });
        const b3 = new Block({ id: 'b3', type: 'foo' });

        const list = new BlockList([b1, b2, b3]);

        expect(b1.prev).to.eq(null);
        expect(b1.next).to.eq(b2);

        expect(b2.prev).to.eq(b1);
        expect(b2.next).to.eq(b3);

        expect(b3.prev).to.eq(b2);
        expect(b3.next).to.eq(null);

        const b1_5 = new Block({ id: 'b1.5', type: 'foo' });
        list.splice(1, 0, b1_5);

        expect(b1.prev).to.eq(null);
        expect(b1.next).to.eq(b1_5);

        expect(b1_5.prev).to.eq(b1);
        expect(b1_5.next).to.eq(b2);

        expect(b2.prev).to.eq(b1_5);
        expect(b2.next).to.eq(b3);

        expect(b3.prev).to.eq(b2);
        expect(b3.next).to.eq(null);
    });
});
