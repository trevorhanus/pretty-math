import { expect } from 'chai';
import { BlockPosition } from 'pretty-math/internal';

describe('BlockPosition', () => {

    describe('creation', () => {

        it('root', () => {
            const root = BlockPosition.root();
            expect(root.isRoot).to.eq(true);
            expect(root.toString()).to.eq('root');
            expect(root.depth).to.eq(0);
            expect(root.index).to.eq(null);
            expect(root.childNumber).to.eq(null);
        });

        it('incLevel', () => {
            const root = BlockPosition.root();
            const l1 = root.incLevel(0);
            expect(l1.isRoot).to.eq(false);
            expect(l1.depth).to.eq(1);
            expect(l1.toString()).to.eq('root:0');
            expect(l1.index).to.eq(null);
            expect(l1.childNumber).to.eq(0);
        });

        it('forIndex', () => {
            const root = BlockPosition.root();
            const l1 = root.incLevel(0);
            const i2 = l1.forIndex(2);
            expect(i2.isRoot).to.eq(false);
            expect(i2.depth).to.eq(1);
            expect(i2.index).to.eq(2);
            expect(i2.childNumber).to.eq(0);
            expect(i2.toString()).to.eq('root:0.2');
        });

        it('fromString', () => {
            const root = BlockPosition.fromString('root');
            expect(root.isRoot).to.eq(true);

            const p1Str = 'root:4.2:5.4';
            const p1 = BlockPosition.fromString(p1Str);
            expect(p1.toString()).to.eq(p1Str);
            expect(p1.childNumber).to.eq(5);
            expect(p1.index).to.eq(4);

            const p2Str = 'root:1.2';
            const p2 = BlockPosition.fromString(p2Str);
            expect(p2.toString()).to.eq(p2Str);
            expect(p2.childNumber).to.eq(1);
            expect(p2.index).to.eq(2);
        });

    });

    describe('isLeftOf', () => {

        it('same list, same level', () => {
            const p1 = BlockPosition.fromString('root:0.0');
            const p2 = BlockPosition.fromString('root:0.1');
            expect(p1.isLeftOf(p2));
        });

        it('same level, different list', () => {
            const p1 = BlockPosition.fromString('root:0.0:0.1');
            const p2 = BlockPosition.fromString('root:0.4:0.1');
            expect(p1.isLeftOf(p2)).to.eq(true);
            expect(p2.isLeftOf(p1)).to.eq(false);
        });

        it('same position', () => {
            const p1 = BlockPosition.fromString('root:0.0:4.10');
            const p2 = BlockPosition.fromString('root:0.0:4.10');
            expect(p1.isLeftOf(p2)).to.eq(false);
            expect(p2.isLeftOf(p1)).to.eq(false);
        });

        it('both root', () => {
            const p1 = BlockPosition.fromString('root');
            const p2 = BlockPosition.fromString('root');
            expect(p1.isLeftOf(p2)).to.eq(false);
            expect(p2.isLeftOf(p1)).to.eq(false);
        });

        it('same parent, different list', () => {
            const p1 = BlockPosition.fromString('root:0.1:0.0');
            const p2 = BlockPosition.fromString('root:0.1:2.0');
            expect(p1.isLeftOf(p2)).to.eq(true);
            expect(p2.isLeftOf(p1)).to.eq(false);
        });
    });

    it('isBelow', () => {
        [
            {
                p1: 'root',
                p2: 'root:0',
                p2IsBelowP1: true,
            },
            {
                p1: 'root:0',
                p2: 'root',
                p2IsBelowP1: false,
            },
            {
                p1: 'root:0.2',
                p2: 'root:1.2',
                p2IsBelowP1: false,
            },
            {
                p1: 'root:0.0:1.0',
                p2: 'root:0.0:2.0',
                p2IsBelowP1: false,
            },
            {
                p1: 'root:0.0:2',
                p2: 'root:0.0:2.0',
                p2IsBelowP1: true,
            }
        ].forEach(test => {
            const p1 = BlockPosition.fromString(test.p1);
            const p2 = BlockPosition.fromString(test.p2);
            expect(p2.isBelow(p1)).to.eq(test.p2IsBelowP1);
        });
    });
});
