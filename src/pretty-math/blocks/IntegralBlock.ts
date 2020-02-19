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
    ICursorPosition,
} from 'pretty-math/internal';
import { Output } from 'pretty-math/utils';

const INNER = 'inner';
const INNER_CHAIN_NUM = 3;
const LEFT_BOUND = 'leftBound';
const LEFT_BOUND_CHAIN_NUM = 2;
const RIGHT_BOUND = 'rightBound';
const RIGHT_BOUND_CHAIN_NUM = 1;
const WRT = 'wrt';
const WRT_CHAIN_NUM = 4;

const INTEGRAL_BLOCK_OPTS: CompositeBlockOpts = {
    type: BlockType.Integral,
    children: {
        rightBound: {
            canBeNull: true,
            chainNumber: RIGHT_BOUND_CHAIN_NUM,
            name: RIGHT_BOUND,
        },
        leftBound: {
            canBeNull: true,
            chainNumber: LEFT_BOUND_CHAIN_NUM,
            name: LEFT_BOUND,
        },
        inner: {
            canBeNull: false,
            chainNumber: INNER_CHAIN_NUM,
            name: INNER,
        },
        wrt: {
            canBeNull: false,
            chainNumber: WRT_CHAIN_NUM,
            name: WRT,
        },
    },
    cursorOrder: {
        leftToRight: [LEFT_BOUND, RIGHT_BOUND, INNER, WRT],
        upToDown: [RIGHT_BOUND, LEFT_BOUND],
    },
    entries: {
        fromLeft: {
            up: RIGHT_BOUND,
            right: LEFT_BOUND,
            down: LEFT_BOUND,
        },
        fromRight: {
            left: WRT,
        }
    }
};

export class IntegralBlock extends CompositeBlock {

    constructor(id?: string) {
        super(INTEGRAL_BLOCK_OPTS, null, null, id);
    }

    get innerChain(): BlockChain {
        return this.getChain(INNER);
    }

    get leftBoundChain(): BlockChain {
        return this.getChain(LEFT_BOUND)
    }

    get rightBoundChain(): BlockChain {
        return this.getChain(RIGHT_BOUND);
    }

    get wrtChain(): BlockChain {
        return this.getChain(WRT);
    }

    @computed
    get inner(): IBlock {
        return this.innerChain.chainStart;
    }

    @computed
    get leftBound(): IBlock {
        return this.leftBoundChain.chainStart;
    }

    @computed
    get rightBound(): IBlock {
        return this.rightBoundChain.chainStart;
    }

    @computed
    get wrt(): IBlock {
        return this.wrtChain.chainStart;
    }

    @action
    removeNextOutOfChild(dir: Dir, child: IBlock): ICursorPosition {
        switch (true) {
            case child === this.inner && dir === Dir.Left:
                if (this.inner.type !== BlockType.Blank) {
                    // delete the integral
                    // move the inner up a level
                    this.inner.setParent(null, null);
                    this.insertChainRight(this.inner);
                }
                return this.removeNext(1);

            case (child === this.leftBound || child === this.rightBound)
                && this.leftBound.type === BlockType.Blank
                && this.rightBound.type === BlockType.Blank:
                this.removeChild(this.rightBound);
                return this.removeChild(this.leftBound);

            case child === this.leftBound && this.leftBound.type === BlockType.Blank:
                return { block: this.rightBound.chainEnd, offset: 1 };

            case child === this.rightBound && this.rightBound.type === BlockType.Blank:
                return { block: this.leftBound.chainEnd, offset: 1 };

            case child === this.wrt && dir === Dir.Left:
                return { block: this.inner.chainEnd, offset: 1 };

            default:
                return super.removeNextOutOfChild(dir, child);
        }
    }

    @action
    setInner(block: IBlock) {
        this.innerChain.replaceChain(block);
    }

    @action
    setLeftBound(block: IBlock) {
        this.leftBoundChain.replaceChain(block);
    }

    @action
    setRightBound(block: IBlock) {
        this.rightBoundChain.replaceChain(block);
    }

    @action
    setWrt(block: IBlock) {
        this.wrtChain.replaceChain(block);
    }

    toCalchubOutput(): Output {
        let bounds;

        if (this.leftBound != null) {
            bounds = Output.fromMany([
                calchubOutputFromChain(this.leftBound),
                { text: ',', source: this },
            ]);
        }

        if (this.rightBound != null) {
            bounds = bounds.append(calchubOutputFromChain(this.rightBound));
        }

        return Output.fromMany([
            { text: '\\int{', source: this },
            calchubOutputFromChain(this.inner),
            { text: ',', source: this },
            calchubOutputFromChain(this.wrt),
            bounds && { text: ',', source: this },
            bounds,
            { text: '}', source: this },
        ]);
    }

    static fromJS(js: IBlockState): IntegralBlock {
        const block = new IntegralBlock(js.id);
        block.initFromJS(js);
        return block;
    }
}
