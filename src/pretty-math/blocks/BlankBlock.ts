import { action } from 'mobx';
import { Block, BlockType, Dir, IBlock, IBlockState, ICursorPosition } from 'pretty-math/internal';

export class BlankBlock extends Block {

    constructor(id?: string) {
        super('', null, BlockType.Blank, id);
    }

    getCursorPositionAt(offset: number): ICursorPosition {
        return {
            block: this,
            offset: 0,
        };
    }

    clone(): IBlock {
        return new BlankBlock();
    }

    toJSShallow(): IBlockState {
        return {
            id: this.id,
            type: this.type,
        };
    }

    @action
    insertAt(blockChain: IBlock, offset: number): ICursorPosition {
        this.replaceWith(blockChain);
        return {
            block: blockChain,
            offset: 1,
        };
    }

    @action
    removeNext(fromOffset: number): ICursorPosition {
        return super.removeNext(0);
    }
}
