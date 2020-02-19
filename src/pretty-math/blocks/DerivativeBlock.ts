import { extractDifferentialSymbolNames, parseCalchub } from 'math';
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
    Output,
    PartialDifferentialBlock,
} from 'pretty-math/internal';

const INNER = 'inner';
const WRT = 'wrt';

const DERIVATIVE_BLOCK_OPTS: CompositeBlockOpts = {
    type: BlockType.Derivative,
    children: {
        wrt: {
            canBeNull: false,
            chainNumber: 1,
            name: WRT,
        },
        inner: {
            canBeNull: false,
            chainNumber: 2,
            name: INNER,
        },
    },
    cursorOrder: {
        leftToRight: [WRT, INNER],
        upToDown: [INNER, WRT],
    },
    entries: {
        fromLeft: {
            right: WRT,
            down: WRT,
        },
        fromRight: {
            left: INNER,
        }
    }
};

export class DerivativeBlock extends CompositeBlock {

    constructor(id?: string) {
        super(DERIVATIVE_BLOCK_OPTS, null, null, id);
    }

    @computed
    get derivativeOrder(): number {
        try {
            const { root } = parseCalchub(this.wrt.toCalchub());
            const diffSymbols = extractDifferentialSymbolNames(root);
            return diffSymbols ? diffSymbols.length : 0;
        } catch (e) {
            return 0;
        }
    }

    get innerChain(): BlockChain {
        return this.getChain(INNER);
    }

    @computed
    get inner(): IBlock {
        return this.innerChain.chainStart;
    }

    @computed
    get localVars(): string[] {
        return [];
    }

    @computed
    get topDDisplayValue(): string {
        let wrtContainsPartial = false;

        this.wrt.forEachBlock(b => {
            if (!wrtContainsPartial) {
                wrtContainsPartial = b instanceof PartialDifferentialBlock;
            }
        });

        return wrtContainsPartial ? '∂' : 'd'
    }

    get wrtChain(): BlockChain {
        return this.getChain(WRT);
    }

    @computed
    get wrt(): IBlock {
        return this.wrtChain.chainStart;
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

    @action
    setWrt(block: IBlock) {
        this.wrtChain.replaceChain(block);
    }

    toCalchubOutput(): Output {
        return Output.fromMany([
            { text: '\\diff{', source: this },
            calchubOutputFromChain(this.inner),
            { text: ',', source: this },
            calchubOutputFromChain(this.wrt),
            { text: '}', source: this },
        ]);
    }

    static fromJS(js: IBlockState): DerivativeBlock {
        const block = new DerivativeBlock(js.id);
        block.initFromJS(js);
        return block;
    }
}
