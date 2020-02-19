import { expect } from 'chai';
import { BlankBlock, Block, BlockBuilder, Dir, FunctionBlock, ICursorPosition } from 'pretty-math/internal';
import { getNextCursorPosition } from 'pretty-math/cursor/CursorPositioner';

const { reduceChains } = BlockBuilder;

describe('CursorPositioner', () => {

    it('Regular Blocks', () => {
        const a = new Block('a');
        const b = new Block('b');
        const c = new Block('c');

        reduceChains([a, b, c]);

        runSequence([
            [null, { block: a, offset: 0 }],
            [Dir.Right, { block: b, offset: 0 }],
            [Dir.Right, { block: c, offset: 0 }],
            [Dir.Right, { block: c, offset: 1 }],
        ], 'to the right');

        runSequence([
            [null, { block: c, offset: 1 }],
            [Dir.Left, { block: c, offset: 0 }],
            [Dir.Left, { block: b, offset: 0 }],
            [Dir.Left, { block: a, offset: 0 }],
        ], 'to the left');
    });

    it('Function Block - blank inner', () => {
        const f = new FunctionBlock('fn', 'fn');
        const b = new BlankBlock();

        f.setInner(b);

        runSequence([
            [null, { block: f, offset: 0 }],
            [Dir.Right, { block: b, offset: 0 }],
            [Dir.Right, { block: f, offset: 1 }],
        ], 'to the right');

        runSequence([
            [null, { block: f, offset: 1 }],
            [Dir.Left, { block: b, offset: 0 }],
            [Dir.Left, { block: f, offset: 0 }],
        ], 'to the left');
    });

    it('Function Block - inner chain', () => {
        const f = new FunctionBlock('fn', 'fn');
        const a = new Block('a');
        const b = new Block('b');
        const c = new Block('c');

        f.setInner(reduceChains([a, b, c]));

        runSequence([
            [null, { block: f, offset: 1 }],
            [Dir.Left, { block: c, offset: 1 }],
            [Dir.Left, { block: c, offset: 0 }],
            [Dir.Left, { block: b, offset: 0 }],
            [Dir.Left, { block: a, offset: 0 }],
            [Dir.Left, { block: f, offset: 0 }],
        ], 'to the left');

        runSequence([
            [null, { block: f, offset: 0 }],
            [Dir.Right, { block: a, offset: 0 }],
            [Dir.Right, { block: b, offset: 0 }],
            [Dir.Right, { block: c, offset: 0 }],
            [Dir.Right, { block: c, offset: 1 }],
            [Dir.Right, { block: f, offset: 1 }],
        ], 'to the right');
    });

    // it('getNextCursorPosition', () => {
    //
    //     const BLOCK_OPTS: CompositeBlockOpts = {
    //         type: BlockType.Block,
    //         children: {
    //             'foo': {
    //                 canBeNull: false,
    //             },
    //             'bar': {
    //                 canBeNull: false,
    //             },
    //             'baz': {
    //                 canBeNull: false,
    //             }
    //         },
    //         childOrder: {
    //             leftToRight: ['foo', 'bar', 'baz'],
    //             upToDown: ['bar', 'foo'],
    //         },
    //         entries: {
    //             fromLeft: {
    //                 up: 'bar',
    //                 right: 'foo',
    //                 down: 'baz',
    //             },
    //             fromRight: {
    //                 up: 'foo',
    //                 left: 'bar',
    //                 down: 'baz',
    //             }
    //         }
    //     };
    //
    //     const cb = new CompositeBlock(BLOCK_OPTS, '', '');
    //     const foo = cb.getChild('foo');
    //     const bar = cb.getChild('bar');
    //     const baz = cb.getChild('baz');
    //
    //     const fooChain = ChainBuilder.buildChain('fo');
    //     const barChain = ChainBuilder.buildChain('bar');
    //     const bazChain = ChainBuilder.buildChain('baz');
    //
    //     foo.setBlock(fooChain);
    //     bar.setBlock(barChain);
    //     baz.setBlock(bazChain);
    //
    //     [
    //         {
    //             descr: 'up from left',
    //             fromOffset: 0,
    //             dir: Dir.Up,
    //             pos: { block: barChain, offset: 0 },
    //         },
    //         {
    //             descr: 'right from left',
    //             fromOffset: 0,
    //             dir: Dir.Right,
    //             pos: { block: fooChain, offset: 0 },
    //         },
    //         {
    //             descr: 'down from left',
    //             fromOffset: 0,
    //             dir: Dir.Down,
    //             pos: { block: bazChain, offset: 0 },
    //         },
    //         {
    //             descr: 'up from right',
    //             fromOffset: 1,
    //             dir: Dir.Up,
    //             pos: { block: fooChain.chainEnd, offset: 1 },
    //         },
    //         {
    //             descr: 'left from right',
    //             fromOffset: 1,
    //             dir: Dir.Left,
    //             pos: { block: barChain.chainEnd, offset: 1 },
    //         },
    //         {
    //             descr: 'down from right',
    //             fromOffset: 1,
    //             dir: Dir.Down,
    //             pos: { block: bazChain.chainEnd, offset: 1 },
    //         },
    //     ].forEach(test => {
    //         const { descr, fromOffset, dir, pos } = test;
    //         const actualPosition = cb.getNextCursorPosition(dir, fromOffset);
    //         expect(pos, descr).to.deep.eq(actualPosition);
    //     });
    //
    // });

    // it('getNextCursorPositionOutOfChild', () => {
    //
    //     const BLOCK_OPTS: CompositeBlockOpts = {
    //         type: BlockType.Block,
    //         children: {
    //             'foo': {
    //                 canBeNull: false,
    //             },
    //             'bar': {
    //                 canBeNull: false,
    //             },
    //             'baz': {
    //                 canBeNull: false,
    //             }
    //         },
    //         childOrder: {
    //             leftToRight: ['foo', 'bar', 'baz'],
    //             upToDown: ['bar', 'foo'],
    //         },
    //         entries: {
    //             fromLeft: {
    //                 up: 'bar',
    //                 right: 'foo',
    //                 down: 'baz',
    //             },
    //             fromRight: {
    //                 up: 'foo',
    //                 left: 'bar',
    //                 down: 'baz',
    //             }
    //         }
    //     };
    //
    //     const cb = new CompositeBlock(BLOCK_OPTS, '', '');
    //     const fooChild = cb.getChild('foo');
    //     const barChild = cb.getChild('bar');
    //     const bazChild = cb.getChild('baz');
    //
    //     const fooChain = ChainBuilder.buildChain('fo');
    //     const barChain = ChainBuilder.buildChain('bar');
    //     const bazChain = ChainBuilder.buildChain('baz');
    //
    //     fooChild.setBlock(fooChain);
    //     barChild.setBlock(barChain);
    //     bazChild.setBlock(bazChain);
    //
    //     [
    //         {
    //             descr: 'left out of foo',
    //             dir: Dir.Left,
    //             outOf: fooChain,
    //             pos: { block: cb, offset: 0 },
    //         },
    //         {
    //             descr: 'left out of bar',
    //             dir: Dir.Left,
    //             outOf: barChain,
    //             pos: { block: fooChain.chainEnd, offset: 1 },
    //         },
    //         {
    //             descr: 'left out of baz',
    //             dir: Dir.Left,
    //             outOf: bazChain,
    //             pos: { block: barChain.chainEnd, offset: 1 },
    //         },
    //         {
    //             descr: 'right out of foo',
    //             dir: Dir.Right,
    //             outOf: fooChain.chainEnd,
    //             pos: { block: barChain, offset: 0 },
    //         },
    //     ].forEach(test => {
    //         const { descr, dir, pos, outOf } = test;
    //         const actualPosition = cb.getNextCursorPositionOutOfChild(dir, outOf);
    //         expect(pos, descr).to.deep.eq(actualPosition);
    //     });
    // });
    //
    // it('getNextCursorPosition (Up)', () => {
    //     const f = ChainBuilder.buildChain('foo');
    //     const o1 = f.right;
    //     const o2 = o1.right;
    //
    //     expect(f.getNextCursorPosition(Dir.Up, 0)).to.eq(null);
    //     expect(f.getNextCursorPosition(Dir.Right, 1)).to.deep.eq({ block: o1, offset: 1 });
    //     expect(o1.getNextCursorPosition(Dir.Right, 1)).to.deep.eq({ block: o2, offset: 1 });
    //     expect(o2.getNextCursorPosition(Dir.Right, 1)).to.deep.eq(null);
    // });

    // it('getNextCursorPosition (Left) no siblings', () => {
    //     const blank = new BlankBlock();
    //
    //     expect(blank.getNextCursorPosition(Dir.Left, 0)).to.be.null;
    //     expect(blank.getNextCursorPosition(Dir.Left, -1)).to.deep.eq({ block: blank, offset: 0 });
    //     expect(blank.getNextCursorPosition(Dir.Left, 1)).to.deep.eq({ block: blank, offset: 0 });
    // });
    //
    // it('getNextCursorPosition (Left) with parent', () => {
    //     const parent = new RadicalBlock();
    //     const stub = sinon.stub();
    //     parent.getNextCursorPositionOutOfChild = stub;
    //     const blank = new BlankBlock();
    //     parent.setInner(blank);
    //
    //     blank.getNextCursorPosition(Dir.Left, 0);
    //
    //     expect(stub.callCount).to.eq(1);
    //     expect(stub.getCall(0).args[0]).to.eq(Dir.Left);
    // });
    //
    // it('getNextCursorPosition (Right) no siblings', () => {
    //     const blank = new BlankBlock();
    //     expect(blank.getNextCursorPosition(Dir.Right, 0)).to.be.null;
    // });
    //
    // it('getNextCursorPosition (Right) with parent', () => {
    //     const parent = new RadicalBlock();
    //     const stub = sinon.stub();
    //     parent.getNextCursorPositionOutOfChild = stub;
    //     const blank = new BlankBlock();
    //     parent.setInner(blank);
    //
    //     blank.getNextCursorPosition(Dir.Right, 0);
    //
    //     expect(stub.callCount).to.eq(1);
    //     expect(stub.getCall(0).args[0]).to.eq(Dir.Right);
    // });
});

export type SequenceStep = [Dir, ICursorPosition];

function runSequence(seq: SequenceStep[], name?: string) {
    let step = 0;
    let [ dir, cp ] = seq.shift();

    while (seq.length > 0) {
        step++;
        const [dir, expected] = seq.shift();
        cp = getNextCursorPosition(cp.block, cp.offset, dir);
        // console.log('step: ', step);
        // console.log('expected: ', expected.block.text, expected.offset);
        // console.log('cp: ', cp.block.text, cp.offset);
        expect(cp, `Error at step ${step} in sequence ${name}.`).to.deep.eq(expected);
    }
}
