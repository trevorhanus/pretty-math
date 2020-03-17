import { action, computed, IObservableArray, observable } from 'mobx';
import {
    BlankBlock,
    Block,
    BlockBuilder,
    BlockChain,
    BlockChainOpts,
    BlockType,
    calchubOutputFromChain,
    Dir,
    exhausted,
    IBlock,
    IBlockState,
    ICompositeBlock,
    ICursorPosition,
    Output,
} from 'pretty-math/internal';

export class MatrixBlock extends Block implements ICompositeBlock {
    rows: IObservableArray<IObservableArray<BlockChain>>;

    constructor(id?: string) {
        super('Matrix', null, BlockType.Matrix, id);
        this.rows = observable.array<IObservableArray<BlockChain>>([], { deep: false });
    }

    @computed
    get chains(): BlockChain[] {
        return this.rows.reduce((chains, row) => {
            chains.push(...row.slice());
            return chains;
        }, []);
    }

    @computed
    get children(): IBlock[] {
        const flattened: IBlock[] = [];
        for (let i = 0; i < this.rows.length; i++) {
            for (let j = 0; j < this.rows[i].length; j++) {
                const chain = this.rows[i][j];
                flattened.push(chain && chain.chainStart);
            }
        }
        return flattened;
    }

    @computed
    get firstCell(): IBlock {
        return this.firstCellChain && this.firstCellChain.chainStart;
    }

    @computed
    get firstCellChain(): BlockChain {
        return this.firstRow && this.firstRow[0];
    }

    @computed
    get firstRow(): IObservableArray<BlockChain> {
        return this.rows[0];
    }

    get isComposite(): true {
        return true;
    }

    @computed
    get lastRow(): IObservableArray<BlockChain> {
        return this.rows[this.rows.length - 1];
    }

    @computed
    get numRows(): number {
        return this.rows.length;
    }

    @computed
    get numCells(): number {
        return this.numRows * this.numCols;
    }

    @computed
    get numCols(): number {
        return this.numRows > 0 ? this.rows[0].length : 0;
    }

    contains(block: IBlock): boolean {
        return super.contains(block) || this.chains.some(chain => chain.contains(block));
    }

    getChainAtChainPosition(chainPosition: number): BlockChain {
        if (chainPosition == null || chainPosition < 1 || chainPosition > this.numCells) {
            return null;
        }

        // chainPosition is 1-based, so switch to zero-based
        // for easier calculation
        const pos = chainPosition - 1;
        const rows = this.numRows;
        const row = pos / rows;
        const col = pos % rows;

        return this.rows[row][col];
    }

    getChildPosition(child: IBlock): [number, number] {
        child = child.chainStart;

        for (let i = 0; i < this.rows.length; i++) {
            for (let j = 0; j < this.rows[i].length; j++) {
                const chain = this.rows[i][j];
                if (chain && chain.contains(child)) {
                    return [i, j];
                }
            }
        }

        return null;
    }

    getEntryBlock(from: number, dir: Dir): IBlock {
        const entry = {
            0: {
                [Dir.Left]: () => null,
                [Dir.Right]: () => this.firstRow[0].chainStart,
                [Dir.Up]: () => this.firstRow[0].chainStart,
                [Dir.Down]: () => this.lastRow[0].chainStart,
            },
            1: {
                [Dir.Left]: () => this.lastRow[this.numCols - 1].chainEnd,
                [Dir.Right]: () => null,
                [Dir.Up]: () => this.firstRow[this.numCols - 1].chainEnd,
                [Dir.Down]: () => this.lastRow[this.numCols - 1].chainEnd,
            }
        };

        return entry[from][dir]();
    }

    getNextChild(child: IBlock, dir: Dir): IBlock {
        const pos = this.getChildPosition(child);

        if (!pos) {
            return null;
        }

        let [row, col] = pos;

        switch (dir) {
            case Dir.Left:
                col = col - 1;
                break;
            case Dir.Right:
                col = col + 1;
                break;
            case Dir.Down:
                row = row + 1;
                break;
            case Dir.Up:
                row = row - 1;
                break;
            default:
                exhausted(dir);
        }

        if (row < 0 || col < 0) {
            return null;
        }

        if (row >= this.numRows || col >= this.numCols) {
            return null;
        }

        const r = this.rows[row];
        const c = r[col];
        return c ? c.chainStart : null;
    }

    isInside(block: IBlock): boolean {
        return this.children.some(child => child.contains(block));
    }

    isInsideInclusive(block: IBlock): boolean {
        return this === block || this.isInside(block);
    }

    @action
    insertBlankCol(atIndex?: number) {
        atIndex = atIndex || this.numCols;

        if (this.numRows === 0) {
            this.insertBlankRow();
        }

        this.rows.forEach((row, rowIndex) => {
            const chain = new BlockChain(this, chainOpts(rowIndex, atIndex));
            row.splice(atIndex, 0, chain);
        });
    }

    @action
    insertBlankRow(atIndex?: number) {
        atIndex = atIndex || this.numRows;

        const row = observable.array<BlockChain>([], { deep: false });

        let i = 0;
        while (i < this.numCols) {
            const chain = new BlockChain(this, {
                chainNumber: chainNumber(atIndex, i),
                canBeNull: false,
                startNull: false,
                name: `cell:${atIndex}:${i}`,
            });
            row.push(chain);
            i++;
        }

        this.rows.splice(atIndex, 0, row);
    }

    @action
    pushRow(row: IBlock[]) {
        const rowIndex = this.numRows;
        const chains: BlockChain[] = [];
        row.forEach((block, colIndex) => {
            const chain = new BlockChain(this, chainOpts(rowIndex, colIndex));
            chain.replaceChain(block);
            chains.push(chain);
        });
        this.rows.push(observable.array(chains, { deep: false }));
    }

    @action
    removeChild(child: IBlock): ICursorPosition {
        const newChild = this.replaceChild(child, null);
        return { block: newChild, offset: 0 };
    }

    @action
    removeCol(oneBasedIndex?: number) {
        oneBasedIndex = oneBasedIndex != null ? oneBasedIndex : this.numCols;

        if (oneBasedIndex < 1 || oneBasedIndex > this.numCols) {
            // out of bounds
            return;
        }

        if (this.numCols === 1) {
            this.insertBlankCol();
        }

        this.rows.forEach(row => {
            const i = oneBasedIndex - 1;
            const oldChain = row[i];
            oldChain.removeFromTree();
            row.splice(i, 1);
        });
    }

    @action
    removeNextOutOfChild(dir: Dir, child: IBlock): ICursorPosition {
        return null;
    }

    @action
    removeRow(oneBasedIndex?: number) {
        oneBasedIndex = oneBasedIndex != null ? oneBasedIndex : this.numRows;

        if (oneBasedIndex < 1 || oneBasedIndex > this.numRows) {
            // index out of bounds
            return;
        }
        const i = oneBasedIndex - 1;
        const row = this.rows[i];

        row.forEach(c => {
            c.removeFromTree();
        });

        if (this.numRows === 1) {
            // last row, add a row below
            // which will replace the removed row
            this.insertBlankRow();
        }

        this.rows.splice(i, 1);
    }

    @action
    replaceChild(oldChild: IBlock, newChild: IBlock): IBlock {
        const pos = this.getChildPosition(oldChild);

        if (!pos) {
            return null;
        }

        oldChild.setParent(null, null);

        const [i, j] = pos;

        const chain = new BlockChain(this, chainOpts(i, j));
        newChild = newChild || new BlankBlock();
        chain.replaceChain(newChild);
        this.rows[i].splice(j, 1, chain);
        return newChild;
    }

    @action
    updateSize(rows: number, cols: number) {
        if (rows && rows > 0 && rows < 25) {
            while (this.numRows !== rows) {
                this.numRows < rows ? this.insertBlankRow() : this.removeRow();
            }
        }
        if (cols && cols > 0 && cols < 25) {
            while (this.numCols !== cols) {
                this.numCols < cols ? this.insertBlankCol() : this.removeCol();
            }
        }
    }

    toCalchubOutput(): Output {
        const rows = Output.fromMany(this.rows.map(row => {
            return Output.fromMany(row.map(item => calchubOutputFromChain(item.chainStart)))
                .between({ text: ',', source: this })
                .prepend({ text: '[', source: this })
                .append({ text: ']', source: this });
        }));

        return Output.fromMany([
            { text: '\\matrix{[', source: this },
            rows.between({ text: ',', source: this }),
            { text: ']}', source: this },
        ]);
    }

    toJSShallow(): IBlockState {
        return {
            ...super.toJSShallow(),
            rows: this.rows.map(row => row.map(c => c.chainStart.toJS())),
        };
    }

    static fromJS(js: IBlockState): MatrixBlock {
        const m = new MatrixBlock(js.id);
        const rows = js.rows || [];

        rows.forEach(row => {
            m.pushRow(row.map(js => BlockBuilder.fromJS(js)));
        });

        return m;
    }
}

function chainOpts(rowIndex: number, colIndex: number): BlockChainOpts {
    return {
        chainNumber: chainNumber(rowIndex, colIndex),
        canBeNull: false,
        startNull: false,
        name: `cell:${rowIndex}:${colIndex}`,
    }
}

function chainNumber(rowIndex: number, colIndex: number): number {
    return rowIndex + colIndex + 1;
}
