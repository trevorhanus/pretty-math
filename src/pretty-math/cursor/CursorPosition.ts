import { between } from 'common';
import { IBlock } from 'pretty-math/internal';
import { BlockPosition } from 'pretty-math/utils/BlockPosition';

export interface ICursorPosition {
    block: IBlock;
    offset: number;
}

export class CursorPosition {
    block: IBlock;
    offset: number;

    constructor(block: IBlock, offset: number) {
        this.block = block;
        this.offset = between(0, 1, offset);
    }

    get isBlank(): boolean {
        return this.block == null;
    }

    get leftBlock(): IBlock {
        return this.offset === 0 ? this.block.left : this.block;
    }

    get blockPosition(): BlockPosition {
        return this.block && this.block.position;
    }

    get rightBlock(): IBlock {
        return this.offset === 0 ? this.block : this.block.right;
    }

    isEqualTo(cp: CursorPosition): boolean {
        return this.block === cp.block && this.offset === cp.offset;
    }

    isLeftOf(cp: CursorPosition): boolean {
        if (!this.blockPosition) {
            return false;
        }

        // cp is below our blockPosition
        if (cp.blockPosition.isBelow(this.blockPosition)) {
            // then we need to look at offset
            return this.offset === 0;
        }

        return this.blockPosition.isLeftOf(cp.blockPosition)
            || (
                this.blockPosition.equals(cp.blockPosition)
                && this.offset < cp.offset
            );
    }

    isLeftOfOrEqualTo(cp: CursorPosition): boolean {
        return this.isLeftOf(cp) || this.isEqualTo(cp);
    }

    isRightOf(cp: CursorPosition): boolean {
        if (!this.blockPosition) {
            return false;
        }

        return this.blockPosition.isRightOf(cp.blockPosition)
            || (
                this.blockPosition.equals(cp.blockPosition)
                && this.offset > cp.offset
            );
    }

    isRightOfOrEqualTo(cp: CursorPosition): boolean {
        return this.isRightOf(cp) || this.isEqualTo(cp);
    }

    toJS(): ICursorPosition {
        return {
            block: this.block,
            offset: this.offset,
        };
    }

    static blank(): CursorPosition {
        return new CursorPosition(null, null);
    }
}
