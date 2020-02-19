import { action, computed } from 'mobx';
import {
    BlankBlock,
    BlockBuilder,
    BlockChain,
    BlockChainState,
    BlockType,
    calchubFromChain,
    calchubOutputFromChain,
    CompositeBlock,
    CompositeBlockOpts,
    Dir,
    EngineWithDecorator,
    IBlock,
    IBlockState,
    ICursorPosition,
    RootBlockState,
    warn,
} from 'pretty-math/internal';
import { Output } from 'pretty-math/utils';

const START = 'start';
const START_CHAIN_NUMBER = 1;

const ROOT_BLOCK_OPTS: CompositeBlockOpts = {
    type: BlockType.Root,
    children: {
        start: {
            canBeNull: false,
            chainNumber: START_CHAIN_NUMBER,
            name: START,
        },
    },
    cursorOrder: {
        leftToRight: [START],
        upToDown: [START],
    },
    entries: {
        fromLeft: {
            up: START,
            right: START,
            down: START,
        },
        fromRight: {
            up: START,
            left: START,
            down: START,
        }
    }
};

export class RootBlock extends CompositeBlock {

    constructor(engine: EngineWithDecorator) {
        super(ROOT_BLOCK_OPTS, '', null, BlockType.Root);
        this._engine = engine;
        this.replaceChain(START, new BlankBlock());
    }

    @computed
    get chainStart(): IBlock {
        return this.start.chainStart;
    }

    @computed
    get chainEnd(): IBlock {
        return this.start.chainEnd;
    }

    get depth(): number {
        return -1;
    }

    @computed
    get start(): BlockChain {
        return this.getChain(START);
    }

    getNextChild(child: IBlock, dir: Dir): IBlock {
        return null;
    }

    @action
    applyState(state: RootBlockState) {
        const chain = BlockBuilder.fromJS(state.blocks);
        this.setStartBlock(chain.chainStart);
    }

    @action
    clear(): ICursorPosition {
        const block = this.start.replaceChain(null);
        return { block, offset: 0 };
    }

    clone(): RootBlock {
        let root = new RootBlock(this.engine);
        root.setStartBlock(this.start.chainStart.cloneDeep());
        return root;
    }

    @action
    removeChild(child: IBlock): ICursorPosition {
        const newChild = new BlankBlock();
        this.replaceChild(child, newChild);
        return { block: newChild, offset: 0 };
    }

    @action
    replaceChild(oldChild: IBlock, newChild: IBlock) {
        oldChild.setParent(null, null);
        this.setStartBlock(newChild);
    }

    removeNextOutOfChild(dir: Dir, child: IBlock): ICursorPosition {
        return { block: this.chainStart, offset: 0 };
    }

    setParent(block: IBlock) {
        warn('attempting to set the parent of a root block.');
    }

    @action
    setStartBlock(block: IBlock) {
        this.start.replaceChain(block);
    }

    toCalchub(): string {
        return calchubFromChain(this.start.chainStart);
    }

    toCalchubOutput(): Output {
        return calchubOutputFromChain(this.start.chainStart);
    }

    toJS(): BlockChainState {
        return [this.toJSShallow()];
    }

    toJSShallow(): RootBlockState {
        return {
            id: this.id,
            type: this.type as BlockType.Root,
            blocks: this.start.chainStart && this.start.chainStart.toJS(),
        }
    }

    toRootBlockJS(): RootBlockState {
        return this.toJSShallow();
    }

    static fromJS(js: IBlockState): RootBlock {
        const { blocks } = js;

        const root = new RootBlock(null);
        if (blocks && blocks.length > 0) {
            root.setStartBlock(BlockBuilder.fromJS(blocks));
        }

        return root;
    }
}
