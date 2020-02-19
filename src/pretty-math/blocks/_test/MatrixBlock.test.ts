import { expect } from 'chai';
import { BlankBlock, Block, calchubOutputFromChain, getStartIndexForBlock, IBlock, MatrixBlock } from 'pretty-math/internal';

describe('MatrixBlock', () => {

    it('creation', () => {
        const m = new MatrixBlock();

        expect(m.children.length).to.eq(0);
        expect(m.numRows).to.eq(0);
        expect(m.numCols).to.eq(0);
    });

    it('addRow - from 0', () => {
        const m = new MatrixBlock();

        m.insertBlankRow();

        expect(m.children.length).to.eq(0);
        expect(m.numRows).to.eq(1);
        expect(m.numCols).to.eq(0);
    });

    it('addCol - from 0', () => {
        const m = new MatrixBlock();

        m.insertBlankRow();
        m.insertBlankCol();

        expect(m.children.length).to.eq(1);
        expect(m.numRows).to.eq(1);
        expect(m.numCols).to.eq(1);
        m.children.forEach(c => {
            expect(c.parent).to.eq(m);
        });
    });

    it('getChildPosition', () => {
        const m = new MatrixBlock();

        m.insertBlankRow();
        m.insertBlankRow();
        m.insertBlankCol();
        m.insertBlankCol();

        expect(m.getChildPosition(m.children[0])).to.deep.eq([0, 0]);
        expect(m.getChildPosition(m.children[1])).to.deep.eq([0, 1]);
        expect(m.getChildPosition(m.children[2])).to.deep.eq([1, 0]);
        expect(m.getChildPosition(m.children[3])).to.deep.eq([1, 1]);
        expect(m.getChildPosition(new BlankBlock())).to.eq(null);
    });

    it('replaceChild', () => {
        const m = new MatrixBlock();

        m.insertBlankRow();
        m.insertBlankRow();
        m.insertBlankCol();
        m.insertBlankCol();

        const oldChild = m.children[3];
        const newChild = m.replaceChild(oldChild, new Block('a'));

        expect(m.getChildPosition(newChild)).to.deep.eq([1, 1]);
        expect(m.getChildPosition(oldChild)).to.eq(null);
        expect(oldChild.parent).to.eq(null);
        expect(newChild.parent).to.eq(m);
    });

    it('removeRow', () => {
        const m = new MatrixBlock();

        m.insertBlankRow();
        m.insertBlankRow();
        m.insertBlankRow();
        m.insertBlankCol();
        m.insertBlankCol();
        m.insertBlankCol();
        // 3x3 matrix

        expect(m.numRows).to.eq(3);
        expect(m.numCols).to.eq(3);

        const oldRow = m.rows[0];
        m.removeRow(1);

        oldRow.forEach(c => {
            expect(c.chainStart.parent).to.eq(null);
        });

        expect(m.numRows).to.eq(2);
        expect(m.numCols).to.eq(3);
    });

    it('removeRow - last row', () => {
        const m = new MatrixBlock();

        m.insertBlankRow();
        m.insertBlankCol();
        m.insertBlankCol();
        m.insertBlankCol();

        // 1x3 matrix

        expect(m.numRows).to.eq(1);
        expect(m.numCols).to.eq(3);

        m.removeRow(1);

        expect(m.numRows).to.eq(1);
        expect(m.numCols).to.eq(3);
    });

    it('removeCol', () => {
        const m = new MatrixBlock();

        m.insertBlankRow();
        m.insertBlankRow();
        m.insertBlankRow();
        m.insertBlankCol();
        m.insertBlankCol();
        m.insertBlankCol();
        // 3x3 matrix

        expect(m.numRows).to.eq(3);
        expect(m.numCols).to.eq(3);

        const oldCol = m.rows.map(r => r[0]);
        m.removeCol(1);

        oldCol.forEach(c => {
            expect(c.chainStart.parent).to.eq(null);
        });

        expect(m.numRows).to.eq(3);
        expect(m.numCols).to.eq(2);
    });

    it('removeCol - last Col', () => {
        const m = new MatrixBlock();

        m.insertBlankRow();
        m.insertBlankRow();
        m.insertBlankRow();
        m.insertBlankCol();
        // 3x1 matrix

        expect(m.numRows).to.eq(3);
        expect(m.numCols).to.eq(1);

        m.removeCol(1);

        expect(m.numRows).to.eq(3);
        expect(m.numCols).to.eq(1);
    });

    it('toJS - fromJS', () => {
        const m = new MatrixBlock();

        m.insertBlankRow();
        m.insertBlankRow();
        m.insertBlankCol();
        m.insertBlankCol();

        const js = m.toJS();
        const newM = MatrixBlock.fromJS(js[0]);
        expect(js).to.deep.eq(newM.toJS());
    });

    it('getCalchubOutput: 2x1', () => {
        const m = new MatrixBlock();
        const a = new Block('a');
        const b = new Block('b');
        m.pushRow([a]);
        m.pushRow([b]);

        const { text, sourceMap } = calchubOutputFromChain(m);

        expect(text).to.eq('\\matrix{[[a],[b]]}');

        // \matrix{[[a],[b]]}
        const s = [
            [0, m],
            [10, a],
            [14, b],
        ];

        s.forEach(test => {
            const [ index, block ] = test;
            expect(getStartIndexForBlock(block as IBlock, sourceMap)).to.eq(index);
        });
    });

    it('getCalchubOutput: 2x2', () => {
        const m = new MatrixBlock();
        const a = new Block('a');
        const b = new Block('b');
        const c = new Block('c');
        const d = new Block('d');
        m.pushRow([a, b]);
        m.pushRow([c, d]);

        const { text, sourceMap } = calchubOutputFromChain(m);

        expect(text).to.eq('\\matrix{[[a,b],[c,d]]}');

        // \matrix{[[a,b],[c,d]]}
        // 012345678901234567890123

        const s = [
            [0, m],
            [10, a],
            [12, b],
            [16, c],
            [18, d],
        ];

        s.forEach(test => {
            const [ index, block ] = test;
            expect(getStartIndexForBlock(block as IBlock, sourceMap)).to.eq(index);
        });
    });

    it('contains', () => {
        const m = new MatrixBlock();
        const a = new Block('a');
        const b = new Block('b');
        const c = new Block('c');
        const d = new Block('d');
        m.pushRow([a, b]);
        m.pushRow([c, d]);

        expect(m.contains(a)).to.eq(true);
        expect(m.contains(b)).to.eq(true);
        expect(m.contains(c)).to.eq(true);
        expect(m.contains(d)).to.eq(true);
    });
});
