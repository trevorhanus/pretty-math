import { action, computed } from 'mobx';
import {
    BlockChain,
    BlockType,
    calchubOutputFromChain,
    CompositeBlock,
    CompositeBlockOpts,
    Dir,
    IBlock,
    IBlockState,
    ICursorPosition
} from 'pretty-math/internal';
import { Output } from 'pretty-math/utils';

const INNER = 'inner';

const BLOCK_OPTS: CompositeBlockOpts = {
    type: BlockType.Differential,
    children: {
        inner: {
            canBeNull: false,
            chainNumber: 1,
            name: INNER,
        }
    },
    cursorOrder: {
        leftToRight: [INNER],
        upToDown: [],
    },
    entries: {
        fromLeft: {
            right: INNER,
        },
        fromRight: {
            left: INNER,
        }
    }
};

export class BaseDifferentialBlock extends CompositeBlock {

    constructor(text: string, latex: string, id?: string) {
        super(BLOCK_OPTS, text, latex, id);
    }

    get innerChain(): BlockChain {
        return this.getChain(INNER);
    }

    @computed
    get inner(): IBlock {
        return this.innerChain.chainStart;
    }

    @action
    removeNextOutOfChild(dir: Dir, child: IBlock): ICursorPosition {
        switch (true) {

            case child === this.inner:
                if (this.inner.type != BlockType.Blank) {
                    this.inner.setParent(null, null);
                    this.insertChainRight(this.inner);
                }
                return this.removeNext(1);

            default:
                return super.removeNextOutOfChild(dir, child);
        }
    }

    @action
    setInner(block: IBlock) {
        this.innerChain.replaceChain(block);
    }

    toCalchubOutput(): Output {
        return Output.fromMany([
            { text: this._latex, source: this },
            { text: '{', source: this },
            calchubOutputFromChain(this.inner),
            { text: '}', source: this },
        ]);
    }

    static fromJS(js: IBlockState): BaseDifferentialBlock {
        const { latex } = js;
        const block = latex === '\\wrt' ? new DifferentialBlock(js.id) : new PartialDifferentialBlock(js.id);
        block.initFromJS(js);
        return block;
    }
}

export class DifferentialBlock extends BaseDifferentialBlock {
    constructor(id?: string) {
        super('d', '\\wrt', id);
    }
}

export class PartialDifferentialBlock extends BaseDifferentialBlock {
    constructor(id?: string) {
        super('∂', '\\pwrt', id);
    }
}
