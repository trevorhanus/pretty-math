import { expect } from 'chai';
import { autorun } from 'mobx';
import { Block, BlockType, calchubOutputFromChain, IBlockState, RadicalBlock } from 'pretty-math/internal';

describe('Block', () => {

    it('creation', () => {
        const b = new Block('b');
        expect(b.left).to.be.undefined;
        expect(b.parent).to.be.undefined;
        expect(b.right).to.be.undefined;
    });

    it('setLeft, setParent, setRight', () => {
        const b1 = new Block('b1');
        const b2 = new Block('b2');
        const b3 = new RadicalBlock();
        const b4 = new Block('b4');

        b3.setInner(b1);
        b1.insertChainLeft(b2);
        b1.insertChainRight(b4);

        expect(b1.left).to.eq(b2);
        expect(b1.parent).to.eq(b3);
        expect(b1.right).to.eq(b4);
    });

    it('insertChainLeft', () => {
        const b1 = new Block('b1');
        const b2 = new Block('b2');
        b2.insertChainLeft(b1);
        expect(b1.left).to.be.undefined;
        expect(b1.right).to.eq(b2);
        expect(b2.left).to.eq(b1);
        expect(b2.right).to.be.undefined;
    });

    it('prev helper', () => {
        const b1 = new Block('b1');
        const b2 = new Block('b2');
        b2.insertChainLeft(b1);
        expect(b1.prev).to.eq(null);
        expect(b2.prev).to.eq(b1);
    });

    it('getCalchubOutput', () => {
        const b1 = new Block('b');
        const output = calchubOutputFromChain(b1);
        expect(output.text).to.eq('b');
        expect(output.sourceMap).to.deep.eq([b1]);
    });

    it('getCalchubOutput: with latex', () => {
        const b1 = new Block('b', '\\beta');
        const output = calchubOutputFromChain(b1);
        expect(output.text).to.eq('\\beta');
        expect(output.sourceMap).to.deep.eq([b1, b1, b1, b1, b1]);
    });

    it('getCalchubOutput: for chain', () => {
        const b1 = new Block('b');
        const b2 = new Block('1');
        b1.setRight(b2);

        const output = calchubOutputFromChain(b1);
        expect(output.text).to.eq('b1');
        expect(output.sourceMap).to.deep.eq([b1, b2]);
    });

    it('insertChainLeft (between)', () => {
        const b1 = new Block('b1');
        const b2 = new Block('b2');
        const b3 = new Block('b3');
        b3.insertChainLeft(b1);
        b3.insertChainLeft(b2);
        expect(b1.left).to.be.undefined;
        expect(b1.right).to.eq(b2);
        expect(b2.left).to.eq(b1);
        expect(b2.right).to.eq(b3);
        expect(b3.left).to.eq(b2);
        expect(b3.right).to.be.undefined;
    });

    it('insertChainLeft with parent', () => {
        const parent = new RadicalBlock();
        const b1 = new Block('b1');
        const b2 = new Block('b2');

        b1.insertChainRight(b2);
        parent.setInner(b1);
        // [parent, [b1] [b2]]

        const b3 = new Block('b3');
        b1.replaceWith(b3);

        // [parent, [b3] [b2]]

        expect(b3.right).to.eq(b2);
        expect(b3.parent).to.eq(parent);
        expect(b2.parent).to.eq(parent);
        expect(b1.parent).to.be.undefined;
    });

    it('insertChainRight', () => {
        const b1 = new Block('b');
        const b2 = new Block('b');
        b1.insertChainRight(b2);
        expect(b1.left).to.be.undefined;
        expect(b1.right).to.eq(b2);
        expect(b2.left).to.eq(b1);
        expect(b2.right).to.be.undefined;
    });

    it('insertChainRight (between)', () => {
        const b1 = new Block('b');
        const b2 = new Block('b');
        const b3 = new Block('b');
        b1.insertChainRight(b3);
        b1.insertChainRight(b2);
        expect(b1.left).to.be.undefined;
        expect(b1.right).to.eq(b2);
        expect(b2.left).to.eq(b1);
        expect(b2.right).to.eq(b3);
        expect(b3.left).to.eq(b2);
        expect(b3.right).to.be.undefined;
    });

    it('end', () => {
        const b1 = new Block('b');
        const b2 = new Block('b');
        const b3 = new Block('b');
        b1.insertChainRight(b3);
        b1.insertChainRight(b2);
        expect(b1.chainEnd).to.eq(b3);
        expect(b2.chainEnd).to.eq(b3);
        expect(b3.chainEnd).to.eq(b3);
    });

    it('start', () => {
        const b1 = new Block('b');
        const b2 = new Block('b');
        const b3 = new Block('b');
        b1.insertChainRight(b3);
        b1.insertChainRight(b2);
        expect(b1.chainStart).to.eq(b1);
        expect(b2.chainStart).to.eq(b1);
        expect(b3.chainStart).to.eq(b1);
    });

    it('insertChainLeft (chain)', () => {
        const b1 = new Block('b');
        const b2 = new Block('b');
        const b3 = new Block('b');
        const b4 = new Block('b');
        b1.insertChainRight(b4); // [b1] [b4]
        b2.insertChainRight(b3); // [b2] [b3]

        b4.insertChainLeft(b2); // [b1] [b2] [b3] [b4]
        expect(b1.left).to.be.undefined;
        expect(b1.right).to.eq(b2);
        expect(b2.left).to.eq(b1);
        expect(b2.right).to.eq(b3);
        expect(b3.left).to.eq(b2);
        expect(b3.right).to.eq(b4);
        expect(b4.left).to.eq(b3);
        expect(b4.right).to.be.undefined;
    });

    it('parent comes from start block', () => {
        const b1 = new Block('b');
        const b2 = new Block('b');
        const b3 = new Block('b');
        b1.insertChainRight(b3);
        b1.insertChainRight(b2); // [b1] [b2] [b3]

        const parent = new RadicalBlock();
        parent.setInner(b1);

        expect(b1.parent).to.eq(parent);
        expect(b2.parent).to.eq(parent);
        expect(b3.parent).to.eq(parent);
    });

    it('remove', () => {
        const b1 = new Block('b');
        b1.remove();
        expect(b1.left).to.be.undefined;
        expect(b1.right).to.be.undefined;
        expect(b1.parent).to.be.undefined;
    });

    it('remove (pair)', () => {
        const b1 = new Block('b');
        const b2 = new Block('b');
        b1.insertChainRight(b2);
        // [b1] [b2]
        b1.remove();
        // [b2]
        expect(b1.left).to.be.undefined;
        expect(b1.right).to.be.undefined;
        expect(b1.parent).to.be.undefined;
        expect(b2.left).to.be.undefined;
        expect(b2.right).to.be.undefined;
        expect(b2.parent).to.be.undefined;
    });

    it('remove (chain)', () => {
        const b1 = new Block('b');
        const b2 = new Block('b');
        const b3 = new Block('b');
        b1.insertChainRight(b2);
        b2.insertChainRight(b3);
        // [b1] [b2] [b3]
        b2.remove();
        // [b1] [b3]
        expect(b1.left).to.be.undefined;
        expect(b1.right).to.eq(b3);
        expect(b2.left).to.be.undefined;
        expect(b2.right).to.be.undefined;
        expect(b3.left).to.eq(b1);
        expect(b3.right).to.be.undefined;
    });

    it('replaceWith', () => {
        const b1 = new Block('b');
        const b2 = new Block('b');
        const b3 = new Block('b');
        b1.insertChainRight(b3);
        b1.insertChainRight(b2); // [b1] [b2] [b3]

        const b4 = new Block('b');

        b2.replaceWith(b4); // [b1] [b4] [b3]

        expect(b1.right).to.eq(b4);
        expect(b4.left).to.eq(b1);
        expect(b4.right).to.eq(b3);
        expect(b3.left).to.eq(b4);
    });

    it('replaceWith (chain)', () => {
        const b1 = new Block('b');
        const b2 = new Block('b');
        const b3 = new Block('b');
        b1.insertChainRight(b3);
        b1.insertChainRight(b2); // [b1] [b2] [b3]

        const b4 = new Block('b');
        const b5 = new Block('b');
        b4.insertChainRight(b5);

        b2.replaceWith(b4); // [b1] [b4] [b5] [b3]

        expect(b1.right).to.eq(b4);
        expect(b4.left).to.eq(b1);
        expect(b4.right).to.eq(b5);
        expect(b5.left).to.eq(b4);
        expect(b5.right).to.eq(b3);
        expect(b3.left).to.eq(b5);
    });

    it('contains', () => {
        const b = new Block('b');
        const b2 = new Block('b');
        expect(b.contains(b)).to.be.true;
        expect(b.contains(b2)).to.be.false;

        b.insertChainRight(b2);
        expect(b.contains(b2)).to.be.true;
        expect(b2.contains(b)).to.be.false; // only checks to the right
    });

    it('depth of 1', () => {
        const b1 = new Block('b');
        expect(b1.depth).to.eq(1);
    });

    it('depth of 2', () => {
        const b1 = new RadicalBlock();
        const b2 = new Block('b');
        b1.setInner(b2);
        expect(b1.depth).to.eq(1);
        expect(b2.depth).to.eq(2);
    });

    it('getBlockById()', () => {
        const b1 = new Block('b');
        const b2 = new Block('b');
        const b3 = new Block('b');
        b1.insertChainRight(b2);
        b2.insertChainRight(b3);
        expect(b1.getBlockById(b2.id)).to.eq(b2);
        expect(b1.getBlockById(b3.id)).to.eq(b3);
        expect(b2.getBlockById(b1.id)).to.eq(null);
        expect(b2.getBlockById(b2.id)).to.eq(b2);
        expect(b2.getBlockById(b3.id)).to.eq(b3);
    });

    it('inserting left with a parent', () => {
        const sqrt = new RadicalBlock();
        const b1 = new Block('b1');
        const b2 = new Block('b2');
        const b3 = new Block('b3');

        b2.insertChainRight(b3);
        sqrt.setInner(b2);

        expect(sqrt.inner).to.eq(b2);
        expect(b2.parent).to.eq(sqrt);
        expect(b2.right).to.eq(b3);

        // insert b1 left of b2
        b2.insertChainLeft(b1);

        expect(sqrt.inner).to.eq(b1);
        expect(b1.parent).to.eq(sqrt);
        expect((b2 as any)._parent).to.eq(null);
    });

    it('removing with a parent', () => {
        const sqrt = new RadicalBlock();
        const b1 = new Block('b1');

        sqrt.setInner(b1);

        expect(sqrt.inner).to.eq(b1);
        expect(b1.parent).to.eq(sqrt);

        b1.remove();

        expect(sqrt.inner.type).to.eq(BlockType.Blank);
        expect(b1.parent).to.eq(undefined);
    });

    it('removing start of chain with a parent', () => {
        const sqrt = new RadicalBlock();
        const b1 = new Block('b1');
        const b2 = new Block('b2');
        const b3 = new Block('b3');

        b1.insertChainRight(b2);
        b2.insertChainRight(b3);

        sqrt.setInner(b1);

        expect(sqrt.inner).to.eq(b1);
        expect(b1.parent).to.eq(sqrt);

        b1.remove();

        expect(sqrt.inner).to.eq(b2);
        expect((b2 as any)._parent).to.eq(sqrt);
        expect(b1.parent).to.eq(undefined);
    });

    it('replacing with a parent', () => {
        const sqrt = new RadicalBlock();
        const b1 = new Block('b1');
        const b2 = new Block('b2');

        sqrt.setInner(b1);

        expect(sqrt.inner).to.eq(b1);
        expect(b1.parent).to.eq(sqrt);

        b1.replaceWith(b2);

        expect(sqrt.inner).to.eq(b2);
        expect(b2.parent).to.eq(sqrt);
        expect(b1.parent).to.eq(undefined);
    });

    it('replacing start of chain with a parent', () => {
        const sqrt = new RadicalBlock();
        const b1 = new Block('b1');
        const b2 = new Block('b2');
        const b3 = new Block('b3');

        b2.insertChainRight(b3);
        sqrt.setInner(b2);

        expect(sqrt.inner).to.eq(b2);

        b2.replaceWith(b1);

        expect(sqrt.inner).to.eq(b1);
        expect(b1.parent).to.eq(sqrt);
        expect(b2.parent).to.eq(undefined);
    });

    it('containsShallow', () => {
        const b1 = new Block('b1');
        const sqrt = new RadicalBlock();
        const b2 = new Block('b2');
        b1.insertChainRight(sqrt);
        sqrt.setInner(b2);

        expect(b1.containsShallow(b2)).to.be.false;
    });

    it('toJSShallow()', () => {
        const a = new Block('a');
        expect(a.toJSShallow()).to.deep.include({ type: 'block', text: 'a' });
    });

    it('toJS()', () => {
        const a = new Block('a');
        const b = new Block('b');
        a.insertChainRight(b);
        expect(a.toJS()).to.deep.eq([
            { id: a.id, type: 'block', text: 'a' },
            { id: b.id, type: 'block', text: 'b' }
        ]);
    });

    it('toJS() with latex', () => {
        const a = new Block('a', '\\alpha');
        expect(a.toJS()).to.deep.eq([
            {
                id: a.id,
                type: 'block',
                latex: '\\alpha',
                text: 'a',
            },
        ]);
    });

    it('fromJS() with latex', () => {
        const js: IBlockState = {
            type: BlockType.Block,
            latex: '\\alpha',
            text: 'a',
        };

        const b = Block.fromJS(js);
        expect(b.toCalchub()).to.eq('\\alpha');
        expect(b.text).to.eq('a');
    });

    it('getCalchubOutput', () => {
        const a = new Block('a');

        let text = '';
        let sm = [];
        autorun(() => {
            const output = calchubOutputFromChain(a);
            text = output.text;
            sm = output.sourceMap;
        });

        expect(text).to.eq('a');
        expect(sm).to.deep.eq([a]);

        const b = new Block('b');
        a.insertChainRight(b);

        expect(text).to.eq('ab');
        expect(sm).to.deep.eq([a, b]);

        const al = new Block('α', '\\alpha');
        b.insertChainRight(al);

        expect(text).to.eq('ab\\alpha');
        expect(sm).to.deep.eq([a, b, al, al, al, al, al, al]);

        const c = new Block('c');
        al.insertChainRight(c);

        expect(text).to.eq('ab\\alpha c');
        expect(sm).to.deep.eq([a, b, al, al, al, al, al, al, al, c]);
    });

    it('position', () => {
        const a = new Block('a');
        const b = new Block('a');
        const c = new Block('a');

        a.insertChainRight(b);
        b.insertChainRight(c);

        expect(a.position.toString()).to.eq('0');
        expect(b.position.toString()).to.eq('1');
        expect(c.position.toString()).to.eq('2');
    });
});
