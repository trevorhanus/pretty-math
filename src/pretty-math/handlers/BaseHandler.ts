import { action, computed, observable } from 'mobx';
import {
    Action,
    BlockUtils,
    buildChainFromCalchub,
    CursorPosition,
    Dir,
    EditableEngine,
    getNextCursorPosition,
    IBlock,
    IEventHandler,
    Selection
} from 'pretty-math/internal';

export class BaseHandler implements IEventHandler {
    readonly engine: EditableEngine;
    @observable protected _lastAction: Action;

    constructor(engine: EditableEngine) {
        this.engine = engine;
        this._lastAction = null;
    }

    @computed
    get lastAction(): Action {
        return this._lastAction;
    }

    get root(): IBlock {
        return this.engine.root;
    }

    get selection(): Selection {
        return this.engine.selection;
    }

    @action
    backspace() {
        const { selection } = this;

        const { block, offset } = selection.focus;
        const blockToDelete = offset === 1 ? block : block.left;

        if (selection.isCollapsed && blockToDelete && blockToDelete.isComposite) {
            // just highlight it
            selection.focusTo({ block: blockToDelete, offset: 0 });
            this._lastAction = Action.Select;
            return;
        }

        let nextPosition;
        if (selection.isCollapsed) {
            const { block, offset } = selection.focus;
            nextPosition = block.removeNext(offset);
        } else {
            nextPosition = BlockUtils.removeRange(selection.selectedRange);
        }

        if (!nextPosition && this.engine.onDeleteOutOf) {
            this.engine.onDeleteOutOf(Dir.Left);
        }

        selection.anchorAt(nextPosition);
        this._lastAction = Action.Delete;
    }

    @action
    backspaceAll() {
        const { selection } = this;
        // anchor the selection at the focus
        selection.anchorAt(selection.focus);
        // focus the selection at the start
        const startBlock = this.root.chainStart;
        selection.focusTo({ block: startBlock, offset: 0 });
        // then call backspace
        this.backspace();
    }

    @action
    delete() {
        const { selection } = this;
        let nextPosition = null;

        if (selection.isCollapsed) {
            const { block, offset } = selection.focus;
            nextPosition = block.removeNextRight(offset);
        } else {
            nextPosition = BlockUtils.removeRange(selection.selectedRange)
        }

        selection.anchorAt(nextPosition);
        return this._lastAction = Action.Delete;
    }

    @action
    down() {
        this.collapseOrMoveSelection(Dir.Down);
    }

    @action
    insertText(text: string) {
        const { selection } = this;

        if (!selection.isCollapsed) {
            this.backspace();
        }

        const { block, offset } = this.selection.focus;

        const chain = buildChainFromCalchub(text);
        const nextPosition = block.insertAt(chain, offset);
        this.selection.anchorAt(nextPosition);
        this._lastAction = Action.Insert;
    }

    @action
    left() {
        this.collapseOrMoveSelection(Dir.Left);
    }

    @action
    moveSelectionToEnd() {
        const endBlock = this.root.chainStart.chainEnd;

        const pos = {
            block: endBlock,
            offset: 1,
        };

        this.selection.anchorAt(pos);
        this._lastAction = Action.MoveCursor;
    }

    @action
    moveSelectionToStart() {
        const startBlock = this.root.chainStart;

        const pos = {
            block: startBlock,
            offset: 0,
        };

        this.selection.anchorAt(pos);
        this._lastAction = Action.MoveCursor;
    }

    @action
    pasteData(data: string) {
        this.insertText(data);
    }

    @action
    resetLastAction() {
        this._lastAction = null;
    }

    @action
    return() {
        this.engine.blur();
    }

    @action
    right() {
        this.collapseOrMoveSelection(Dir.Right);
    }

    @action
    selectAll() {
        const startBlock = this.root.chainStart;
        const endBlock = this.root.chainEnd;
        this.selection.anchorAt({ block: startBlock, offset: 0 });
        this.selection.focusTo({ block: endBlock, offset: 1 });
        this._lastAction = Action.Select;
    }

    @action
    selectDown() {
        this.expandSelection(Dir.Down);
    }

    @action
    selectLeft() {
        this.expandSelection(Dir.Left);
    }

    @action
    selectRight() {
        this.expandSelection(Dir.Right);
    }

    @action
    selectUp() {
        this.expandSelection(Dir.Up);
    }

    @action
    selectToStart() {
        const startBlock = this.root.chainStart;
        this.selection.focusTo({ block: startBlock, offset: 0 });
        this._lastAction = Action.MoveCursor;
    }

    @action
    selectToEnd() {
        const endBlock = this.root.chainEnd;
        this.selection.focusTo(endBlock.getCursorPositionAt(1));
        this._lastAction = Action.MoveCursor;
    }

    @action
    tab(e: React.KeyboardEvent) {
        /* noop */
    }

    @action
    up() {
        this.collapseOrMoveSelection(Dir.Up);
    }

    @action
    private collapseOrMoveSelection(dir: Dir) {
        if (this.selection.isEmpty) {
            this.moveSelectionToEnd();
            this._lastAction = Action.MoveCursor;
            return;
        }

        if (!this.selection.isCollapsed) {
            this.selection.collapse(dir);
            this._lastAction = Action.MoveCursor;
            return;
        }

        const { block, offset } = this.selection.focus;
        const nextPosition = getNextCursorPosition(block, offset, dir);

        if (!nextPosition && this.engine.onCursorLeave) {
            this.engine.onCursorLeave(dir);
        }

        this.selection.anchorAt(nextPosition);
        this._lastAction = Action.MoveCursor;
    }

    @action
    private expandSelection(dir: Dir) {
        const { selection } = this;

        if (this.selection.isEmpty) {
            return this.moveSelectionToEnd();
        }

        const { block, offset } = selection.focus;
        const nextPosition = getNextCursorPosition(block, offset, dir);

        if (nextPosition == null) {
            return;
        }

        const leftToRight = nextPosition.block.position.isRightOf(block.position);
        this.selection.focusTo(nextPosition);

        // now move the focus to the end
        if (leftToRight) {
            this.selection.focusTo(this.selection.end);
        } else {
            this.selection.focusTo(this.selection.start);
        }

        this._lastAction = Action.Select;
    }
}
