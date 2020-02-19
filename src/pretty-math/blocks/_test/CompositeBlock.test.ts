import { expect } from 'chai';
import { BlockType, CompositeBlock, CompositeBlockOpts, Dir } from 'pretty-math/internal';

describe('CompositeBlock', () => {

    it('create', () => {

        const BLOCK_OPTS: CompositeBlockOpts = {
            type: BlockType.Block,
            children: {
                foo: {
                    canBeNull: false,
                    chainNumber: 1,
                    name: 'foo',
                },
                bar: {
                    canBeNull: true,
                    chainNumber: 2,
                    name: 'bar',
                }
            },
            cursorOrder: {
                leftToRight: ['foo', 'bar'],
                upToDown: ['bar', 'foo'],
            },
            entries: {
                fromLeft: {
                    right: 'foo',
                },
                fromRight: {
                    left: 'bar',
                }
            }
        };

        const b = new CompositeBlock(BLOCK_OPTS, '', '');
        const foo = b.getChain('foo');
        const bar = b.getChain('bar');

        expect(b.isComposite).to.be.true;
        expect(b.getEntryChain(0, Dir.Right)).to.eq(foo);
        expect(b.getEntryChain(0, Dir.Up)).to.eq(undefined);
        expect(b.getEntryChain(1, Dir.Left)).to.eq(bar);
    });

    it('getNextChild', () => {
        const BLOCK_OPTS: CompositeBlockOpts = {
            type: BlockType.Block,
            children: {
                'foo': {
                    canBeNull: false,
                    chainNumber: 1,
                    name: 'foo',
                },
                'bar': {
                    canBeNull: false,
                    chainNumber: 2,
                    name: 'bar',
                },
                'baz': {
                    canBeNull: false,
                    chainNumber: 3,
                    name: 'baz',
                }
            },
            cursorOrder: {
                leftToRight: ['foo', 'bar', 'baz'],
                upToDown: ['bar', 'foo'],
            },
            entries: {
                fromLeft: {
                    up: 'bar',
                    right: 'foo',
                    down: 'baz',
                },
                fromRight: {
                    up: 'foo',
                    left: 'bar',
                    down: 'baz',
                }
            }
        };

        const cb = new CompositeBlock(BLOCK_OPTS, '', '');
        const foo = cb.getChain('foo');
        const bar = cb.getChain('bar');
        const baz = cb.getChain('baz');

        expect(cb.getNextChain(bar, Dir.Left)).to.eq(foo);
        expect(cb.getNextChain(foo, Dir.Left)).to.eq(undefined);
    });

});
