import { toHex } from 'common';
import { action, computed } from 'mobx';
import {
    BlankBlock,
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
    isBlankBlock,
    Output,
} from 'pretty-math/internal';

const SUB = 'sub';
const SUB_CHAIN_NUM = 1;
const SUP = 'sup';
const SUP_CHAIN_NUM = 2;

const SUP_SUB_BLOCK_OPTS: CompositeBlockOpts = {
    type: BlockType.SupSub,
    children: {
        sub: {
            canBeNull: true,
            chainNumber: SUB_CHAIN_NUM,
            name: SUB,
        },
        sup: {
            canBeNull: true,
            chainNumber: SUP_CHAIN_NUM,
            name: SUP,
        },
    },
    cursorOrder: {
        leftToRight: [SUB, SUP],
        upToDown: [SUP, SUB],
    },
    entries: {
        fromLeft: {
            up: SUP,
            right: SUB,
            down: SUB,
        },
        fromRight: {
            up: SUP,
            left: SUP,
            down: SUB,
        }
    }
};

export class SupSubBlock extends CompositeBlock {

    constructor(sup?: IBlock, sub?: IBlock, id?: string) {
        super(SUP_SUB_BLOCK_OPTS, null, null, id);
        this.setSup(sup);
        this.setSub(sub);
    }

    get subChain(): BlockChain {
        return this.getChain(SUB);
    }

    get supChain(): BlockChain {
        return this.getChain(SUP);
    }

    @computed
    get sub(): IBlock {
        return this.getChain(SUB).chainStart;
    }

    @computed
    get sup(): IBlock {
        return this.getChain(SUP).chainStart;
    }

    clone(): SupSubBlock {
        let supSub = new SupSubBlock();

        if (this.sup != null) {
            supSub.setSup(this.sup.cloneDeep());
        }

        if (this.sub != null) {
            supSub.setSub(this.sub.cloneDeep());
        }

        return supSub;
    }

    getNextCursorPositionAddSubscript(dir: Dir): ICursorPosition {
        switch(true) {

            case this.sub == null:
                this.setSub(new BlankBlock());
                return this.sub.getCursorPositionAt(0);

            case this.sub != null && dir === Dir.Left:
                return { block: this.sub.chainEnd, offset: 1 };

            default:
                return { block: this.sub, offset: 0 };
        }
    }

    getNextCursorPositionAddSuperscript(dir: Dir): ICursorPosition {
        switch(true) {

            case this.sup == null:
                this.setSup(new BlankBlock());
                return this.sup.getCursorPositionAt(0);

            case this.sup != null && dir == Dir.Left:
                return { block: this.sup.chainEnd, offset: 1 };

            default:
                return { block: this.sup, offset: 0 };
        }
    }

    private removeBlankSupOrSub(dir: Dir): ICursorPosition {
        let position = { block: this as IBlock, offset: (dir === Dir.Right ? 1 : 0) };

        if (isBlankBlock(this.sup)) {
            this.setSup(null);
        }

        if (isBlankBlock(this.sub)) {
            this.setSub(null);
        }

        if (this.sup == null && this.sub == null) {
            position = { block: this.left, offset: 1 };
            return this.removeNext(1);
        }

        return position;
    }

    @action
    removeNextOutOfChild(dir: Dir, child: IBlock): ICursorPosition {
        switch (true) {

            case child === this.sup && this.sub == null:
                // no sub, so just remove the whole block
                return this.removeNext(1);

            case child === this.sub && this.sup == null:
                // no sup, so just remove the whole block
                return this.removeNext(1);

            default:
                this.removeBlankSupOrSub(Dir.Left);
                return { block: this, offset: 0 };
        }
    }

    @action
    setSub(block: IBlock) {
        this.subChain.replaceChain(block);
    }

    @action
    setSup(block: IBlock) {
        this.supChain.replaceChain(block);
    }

    toCalchubOutput(): Output {
        let output = new Output();

        if (this.sub) {
            output = output.append(
                { text: `_x${toHex('{')}`, source: this },
                Output.expandToHex(calchubOutputFromChain(this.sub)),
                { text: toHex('}'), source: this },
                (this.sup || this.right) && { text: ' ', source: this },
            );
        }

        if (this.sup) {
            output = output.append(
                { text: '^{', source: this },
                calchubOutputFromChain(this.sup),
                { text: '}', source: this },
            );
        }

        return output;
    }

    static fromJS(props: IBlockState): SupSubBlock {
        const supSub = new SupSubBlock(null, null, props.id);

        const supState = props.sup;
        if (supState) {
            const sup = BlockBuilder.fromJS(supState);
            supSub.setSup(sup);
        }

        const subState = props.sub;
        if (subState) {
            const sub = BlockBuilder.fromJS(subState);
            supSub.setSub(sub);
        }

        return supSub;
    }
}
