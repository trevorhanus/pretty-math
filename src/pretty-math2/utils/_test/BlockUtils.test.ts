import { expect } from 'chai';
import { BlockFactory } from '../../blocks/BlockFactory';
import { getCommonParent } from '../BlockUtils';

describe('BlockUtils', () => {

    describe('getCommonParent', () => {

        it('blocks in the same list', () => {
            const root = BlockFactory.createBlock('root:math');
            const a = BlockFactory.createBlock('atomic', { text: 'a' });
            const plus = BlockFactory.createBlock('atomic', { text: '+' });
            const b = BlockFactory.createBlock('atomic', { text: 'b' });
            const inner = root.childMap.inner;
            inner.addBlocks(a, plus, b);

            expect(getCommonParent(a, b)).to.eq(root);
        });

        it('block1 is higher', () => {
            // root(sin(a)+b)
            const root = BlockFactory.createBlock('root:math');
            const sin = BlockFactory.createBlock('math:function', { displayValue: 'sin' });
            const a = BlockFactory.createBlock('atomic', { text: 'a' });
            const plus = BlockFactory.createBlock('atomic', { text: '+' });
            const b = BlockFactory.createBlock('atomic', { text: 'b' });
            const rootInner = root.childMap.inner;
            const sinInner = sin.childMap.inner;
            sinInner.addBlocks(a);
            rootInner.addBlocks(sin, plus, b);

            expect(getCommonParent(plus, a)).to.eq(root);
        });
    });
});
