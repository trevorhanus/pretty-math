import { action, computed } from 'mobx';
import {
    BlankBlock,
    BlockBuilder,
    BlockChain,
    BlockType,
    calchubOutputFromChain,
    CompositeBlock,
    CompositeBlockOpts,
    IBlock,
    IBlockState,
} from 'pretty-math/internal';
import { Output } from 'pretty-math/utils';

const INNER = 'inner';
const INNER_CHAIN_NUM = 1;

const FUNC_BLOCK_OPTS: CompositeBlockOpts = {
    type: BlockType.Function,
    children: {
        inner: {
            canBeNull: false,
            chainNumber: INNER_CHAIN_NUM,
            name: INNER,
        },
    },
    cursorOrder: {
        leftToRight: [INNER],
        upToDown: [INNER],
    },
    entries: {
        fromLeft: {
            up: null,
            right: INNER,
            down: null,
        },
        fromRight: {
            up: null,
            left: INNER,
            down: null,
        }
    }
};

export class FunctionBlock extends CompositeBlock {

    constructor(displayValue: string, latex: string, type = BlockType.Function, id?: string) {
        super({ ...FUNC_BLOCK_OPTS, type }, displayValue, latex, id);
        this.setInner(new BlankBlock());
    }

    get innerChain(): BlockChain {
        return this.getChain(INNER);
    }

    @computed
    get inner(): IBlock {
        return this.innerChain.chainStart;
    }

    clone(): FunctionBlock {
        let func = new FunctionBlock(this._text, this._latex);
        if (this.inner != null) {
            func.setInner(this.inner.cloneDeep());
        }
        return func;
    }

    @action
    setInner(block: IBlock) {
        this.innerChain.replaceChain(block);
    }

    toCalchubOutput(): Output {
        return Output.fromMany([
            { text: this._latex, source: this },
            { text: '{(', source: this },
            calchubOutputFromChain(this.inner),
            { text: ')}', source: this },
        ]);
    }

    static fromJS(props: IBlockState): FunctionBlock {
        const { id, latex, text } = props;
        const fb = new FunctionBlock(text, latex, BlockType.Function, id);
        const innerState = props.inner;
        if (innerState) {
            fb.setInner(BlockBuilder.fromJS(innerState));
        }
        return fb;
    }
}
