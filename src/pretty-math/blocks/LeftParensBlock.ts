import { ColorUtils, isEmpty } from 'common';
import { action, computed } from 'mobx';
import {
    Block,
    BlockType,
    BlockUtils,
    IBlock,
    IBlockState,
    ICursorPosition,
    isLeftParensBlock,
    isRightParensBlock,
    normalizeOffset,
    RightParensBlock,
} from 'pretty-math/internal';
import { Output } from 'pretty-math/utils';

export class LeftParensBlock extends Block {
    private _color: ColorUtils.Color;

    constructor(text: string, latex?: string, id?: string) {
        super(text, latex, BlockType.LeftParens, id);
        this._color = ColorUtils.getRandomColor();
    }

    get rgbColor(): string {
        return this._color.rgbStr;
    }

    @computed
    get rightParensPartner(): RightParensBlock {
        const parensStack: Block[] = [];

        let nextRight = this.right;
        while (nextRight != null) {
            if (isRightParensBlock(nextRight) && BlockUtils.isParensPair(this.text, nextRight.text) && isEmpty(parensStack)) {
                return nextRight;
            }

            if (isRightParensBlock(nextRight)) {
                parensStack.pop();
            }

            if (isLeftParensBlock(nextRight)) {
                parensStack.push(nextRight);
            }

            nextRight = nextRight.right;
        }

        return null;
    }

    clone(): IBlock {
        return new LeftParensBlock(this.text, this._latex);
    }

    @action
    removeNext(fromOffset: number): ICursorPosition {
        fromOffset = normalizeOffset(fromOffset);

        if (fromOffset === 1) {
            if (this.rightParensPartner != null) {
                this.rightParensPartner.remove();
            }
        }

        return super.removeNext(fromOffset);
    }

    toCalchubOutput(): Output {
        const text = this._latex || this.text || '';
        return Output.fromOne({ text, source: this });
    }

    static fromJS(props: IBlockState): LeftParensBlock {
        return new LeftParensBlock(props.text, props.latex, props.id);
    }
}
