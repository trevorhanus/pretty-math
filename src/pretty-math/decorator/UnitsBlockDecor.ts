import { CSSProperties } from 'react';
import { BlockType, IBlock, IBlockDecor } from 'pretty-math/internal';

export class UnitsBlockDecor implements IBlockDecor {
    private _block: IBlock;

    constructor(block: IBlock) {
        this._block = block;
    }

    get className(): string {
        return '';
    }

    get displayValueOverride(): string {
        const { type, text } = this._block;

        switch (true) {
            case type === BlockType.Block && text === '*':
                return '\u22c5';

            default:
                return null;
        }
    }

    get style(): CSSProperties {
        return {};
    }
}
