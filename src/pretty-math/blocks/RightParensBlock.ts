import isEmpty from 'lodash.isempty';
import { computed } from 'mobx';
import {
    Block,
    BlockType,
    IBlock,
    IBlockState,
    isLeftParensBlock,
    isRightParensBlock,
    LeftParensBlock
} from 'pretty-math/internal';
import { Output } from 'pretty-math/utils';

export class RightParensBlock extends Block {

    constructor(text: string, latex?: string, id?: string) {
        super(text, latex, BlockType.RightParens, id);
    }

    @computed
    get rgbColor(): string {
        if (this.leftParensPartner) {
            return this.leftParensPartner.rgbColor;
        } else {
            return '';
        }
    }

    @computed
    get leftParensPartner(): LeftParensBlock {
        const parensStack: Block[] = [];
        let nextLeft = this.left;

        while (nextLeft != null) {
            if (isLeftParensBlock(nextLeft) && isEmpty(parensStack)) {
                return nextLeft;
            }

            if (isLeftParensBlock(nextLeft)) {
                parensStack.pop();
            }

            if (isRightParensBlock(nextLeft)) {
                parensStack.push(nextLeft);
            }

            nextLeft = nextLeft.left;
        }

        return null;
    }

    clone(): IBlock {
        return new RightParensBlock(this.text, this._latex);
    }

    toCalchubOutput(): Output {
        const text = this._latex || this.text || '';
        return Output.fromOne({ text, source: this });
    }

    static fromJS(props: IBlockState): RightParensBlock {
        return new RightParensBlock(props.text, props.latex, props.id);
    }
}
