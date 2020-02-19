import { action } from 'mobx';
import {
    Action,
    BaseHandler,
    BlankBlock,
    BlockBuilder,
    BlockType,
    Dir,
    isSupSubBlock,
    SupSubBlock,
    UnitsEngine
} from 'pretty-math/internal';
import { getNextCursorPosition } from 'pretty-math/cursor/CursorPositioner';

export class UnitsHandler extends BaseHandler {

    constructor(engine: UnitsEngine) {
        super(engine);
    }

    @action
    insertText(text: string) {
        const { selection } = this;

        if (!selection.isCollapsed) {
            this.backspace();
        }

        // a couple of special cases
        switch (text) {

            case '^':
                return this.insertSup();
        }

        this.insertPlainBlock(text);
    }

    @action
    private insertPlainBlock(text: string) {
        const { block, offset } = this.selection.focus;
        const blockChain = BlockBuilder.chainFromString(text);
        let nextPosition = block.insertAt(blockChain, offset);
        this.selection.anchorAt(nextPosition);
        this._lastAction = Action.Insert;
    }

    @action
    private insertSup() {
        const focusBlock = this.selection.focus.block;
        const focusOffset = this.selection.focus.offset;

        if (focusBlock.type === BlockType.Blank) {
            return;
        }

        if (focusBlock.depth > 0) {
            this.insertPlainBlock('^');
            return;
        }

        if (!this.checkForCurrentSupSub(Dir.Up)) {
            const newSupSub = new SupSubBlock(new BlankBlock());
            focusBlock.insertAt(newSupSub, focusOffset);
            let nextPosition = getNextCursorPosition(newSupSub, 1, Dir.Left);
            this.selection.anchorAt(nextPosition);
            this._lastAction = Action.Insert;
        }
    }

    private checkForCurrentSupSub(dir: Dir): boolean {
        const { focus } = this.selection;

        if (isSupSubBlock(focus.rightBlock)) {
            let nextPosition = getNextCursorPosition(focus.rightBlock, 0, dir);
            if (nextPosition) {
                this.selection.anchorAt(nextPosition);
                this._lastAction = Action.MoveCursor;
                return true;
            }
        }

        if (isSupSubBlock(focus.leftBlock)) {
            let nextPosition = getNextCursorPosition(focus.leftBlock, 1, dir);
            if (nextPosition) {
                this.selection.anchorAt(nextPosition);
                this._lastAction = Action.MoveCursor;
                return true;
            }
        }
    }
}
