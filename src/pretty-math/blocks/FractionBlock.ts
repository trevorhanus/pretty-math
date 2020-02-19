import { action, computed } from 'mobx';
import {
    Block,
    BlockBuilder,
    BlockChain,
    BlockType,
    calchubOutputFromChain,
    CompositeBlock,
    CompositeBlockOpts,
    Dir,
    IBlock,
    IBlockState,
    ICursorPosition,
    warn
} from 'pretty-math/internal';
import { Output } from 'pretty-math/utils';

const DENOM = 'denom';
const DENOM_CHAIN_NUM = 2;
const NUM = 'num';
const NUM_CHAIN_NUM = 1;

const FRACTION_BLOCK_OPTS: CompositeBlockOpts = {
    type: BlockType.Fraction,
    children: {
        num: {
            canBeNull: false,
            chainNumber: NUM_CHAIN_NUM,
            name: NUM,
        },
        denom: {
            canBeNull: false,
            chainNumber: DENOM_CHAIN_NUM,
            name: DENOM,
        }
    },
    cursorOrder: {
        leftToRight: [NUM],
        upToDown: [NUM, DENOM],
    },
    entries: {
        fromLeft: {
            up: NUM,
            right: NUM,
            down: DENOM,
        },
        fromRight: {
            up: NUM,
            left: NUM,
            down: DENOM,
        }
    }
};

export class FractionBlock extends CompositeBlock {

    constructor(num?: IBlock, denom?: IBlock, id?: string) {
        super(FRACTION_BLOCK_OPTS, null, null, id);
        this.setDenom((denom == null ? BlockBuilder.blank() : denom));
        this.setNum((num == null ? BlockBuilder.blank() : num));
    }

    get denomChain(): BlockChain {
        return this.getChain(DENOM);
    }

    get numChain(): BlockChain {
        return this.getChain(NUM);
    }

    @computed
    get denom(): IBlock {
        return this.denomChain.chainStart;
    }

    @computed
    get num(): IBlock {
        return this.numChain.chainStart;
    }

    clone(): FractionBlock {
        let newNum = null;
        if (this.num != null) {
            newNum = this.num.cloneDeep()
        }

        let newDenom = null;
        if (this.denom != null) {
            newDenom = this.denom.cloneDeep();
        }

        return new FractionBlock(newNum, newDenom);
    }

    @action
    removeChild(child: IBlock): ICursorPosition {
        if (this.num === child) {
            const blankBlock = BlockBuilder.blank();
            this.replaceChild(this.num, blankBlock);
            return { block: blankBlock, offset: 0 };
        }

        if (this.denom === child) {
            const blankBlock = BlockBuilder.blank();
            this.replaceChild(this.denom, blankBlock);
            return { block: blankBlock, offset: 0 };
        }

        warn('invariant: removeChild was invoked with a non-child block.');

        return { block: this, offset: 0 };
    }

    @action
    removeNextOutOfChild(dir: Dir, child: IBlock): ICursorPosition {
        if (this.denom != null && this.denom.type === BlockType.Blank && this.num != null && this.num.type != BlockType.Blank) {
            this.insertChainLeft(this.num.cloneDeep());
            this.insertChainLeft(new Block('/'));
            return this.removeNext(1);
        }
        if (this.num != null && this.num.type === BlockType.Blank && this.denom != null && this.denom.type != BlockType.Blank) {
            this.insertChainRight(this.denom.cloneDeep());
            let slash = new Block('/');
            this.insertChainRight(slash);
            this.removeNext(1);
            return { block: slash, offset: 1 };
        }
        if (this.num != null && this.num.type === BlockType.Blank && this.denom != null && this.denom.type === BlockType.Blank) {
            return this.removeNext(1);
        }
        return { block: this, offset: 1 };
    }

    @action
    setDenom(block: IBlock) {
        this.denomChain.replaceChain(block);
    }

    @action
    setNum(block: IBlock) {
        this.numChain.replaceChain(block);
    }

    toCalchubOutput(): Output {
        return Output.fromMany([
            { text: '\\frac{', source: this },
            calchubOutputFromChain(this.num),
            { text: ',', source: this },
            calchubOutputFromChain(this.denom),
            { text: '}', source: this },
        ]);
    }

    static fromJS(props: IBlockState): FractionBlock {
        const frac = new FractionBlock(null, null, props.id);

        const numState = props.num;
        if (numState) {
            const num = BlockBuilder.fromJS(numState);
            frac.setNum(num);
        }

        const denomState = props.denom;
        if (denomState) {
            const denom = BlockBuilder.fromJS(denomState);
            frac.setDenom(denom);
        }

        return frac;
    }
}
