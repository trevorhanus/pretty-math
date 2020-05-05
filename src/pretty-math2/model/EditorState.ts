import { action, computed, observable } from 'mobx';
import { Dir } from 'pretty-math2/interfaces';
import { getNextCursorPosition } from 'pretty-math2/selection/CursorPositioner';
import { removeRange } from 'pretty-math2/utils/RangeUtils';
import * as React from 'react';
import { AssistantStore } from '../assistant/stores/AssistantStore';
import { BlockFactory } from '../blocks/BlockFactory';
import { Selection } from '../selection/Selection';
import { Block, BlockState } from './Block';
import { BlockList } from './BlockList';
import { MathRootBlock, RootBlock } from './RootBlock';

export interface SerializedEditorState {
    root: BlockState;
}

export class EditorState {
    @observable readonly containerRef: React.RefObject<HTMLDivElement>;
    readonly hiddenTextareaRef: React.RefObject<HTMLTextAreaElement>;
    @observable private _hasFocus: boolean;
    @observable private _lastCommand: string;
    readonly assistant: AssistantStore;
    readonly root: RootBlock;
    readonly selection: Selection;

    constructor(rootBlock: RootBlock, initialState?: SerializedEditorState) {
        this.containerRef = React.createRef<HTMLDivElement>();
        this.hiddenTextareaRef = React.createRef<HTMLTextAreaElement>();
        this._hasFocus = false;
        this._lastCommand = null;
        this.assistant = new AssistantStore(this);
        this.root = rootBlock;
        this.root.setEditor(this);
        this.selection = new Selection(this);
        this.applyState(initialState);
    }

    get inner(): BlockList {
        return this.root.childMap.inner;
    }

    @computed
    get hasFocus(): boolean {
        return this._hasFocus;
    }

    @computed
    get lastCommand(): string {
        return this._lastCommand;
    }

    @computed
    get mode(): string {
        return this.selection.focus.mode;
    }

    @action
    applyState(state?: SerializedEditorState) {
        if (state == null) {
            return;
        }

        const oldFocus = this.selection.focus;
        this.root.applyState(state.root);
        // does the previously focused block still exist?
        const newFocus = this.root.getBlockById(oldFocus.id) || this.root.childMap.inner.start;
        this.selection.anchorAt(newFocus);
    }

    blur() {
        this.hiddenTextareaRef.current.blur();
    }

    focus() {
        this.hiddenTextareaRef.current.focus();
    }

    // Didn't import Block before this
    @action
    insertBlock(block: Block) {
        if (!this.selection.isCollapsed) {
            // handle a deleting the selection
        }
        const { focus } = this.selection;
        focus.list.insertBlock(focus, block);
    }

    @action
    moveCursor(dir: Dir) {
        if (!this.selection.isCollapsed) {
            if (dir === Dir.Left) {
                this.selection.anchorAt(this.selection.range.start);
                return;
            }
            if (dir === Dir.Right) {
                this.selection.anchorAt(this.selection.range.end);
                return;
            }
            this.selection.anchorAt(this.selection.focus);
        }
        const { focus } = this.selection;
        this.selection.anchorAt(getNextCursorPosition(focus, dir));
    }

    @action
    moveCursorToFringe(dir: Dir) {
        switch (dir) {
            case Dir.Left:
                this.selection.anchorAt(this.selection.focus.list.start);
                break;

            case Dir.Right:
                this.selection.anchorAt(this.selection.focus.list.end);
                break;
        }
    }

    @action
    moveSelectionFocus(dir: Dir) {
        const { focus } = this.selection;
        this.selection.focusAt(getNextCursorPosition(focus, dir));
        if (this.selection.focus.position.isLower(this.selection.range.start.position)) {
            switch (dir) {
                case Dir.Left:
                case Dir.Up:
                    this.selection.focusAt(this.selection.focus.parent);
                    break;

                case Dir.Right:
                case Dir.Down:
                    this.selection.focusAt(this.selection.focus.parent.next);
                    break;
            }
        }
    }

    @action
    moveSelectionFocusToFringe(dir: Dir) {
        switch (dir) {
            case Dir.Left:
                this.selection.focusAt(this.selection.focus.list.start);
                break;

            case Dir.Right:
                this.selection.focusAt(this.selection.focus.list.end);
                break;
        }
    }

    @action
    remove() {
        if (!this.selection.isCollapsed) {
            const { end } = this.selection.range;
            removeRange(this.selection.range);
            this.selection.anchorAt(end);
            return;
        }

        const { focus } = this.selection;
        const { prev } = focus;

        if (prev) {
            prev.list.removeBlock(prev);
            return;
        }

        if (focus.list.isOnlyEndBlock && focus.list.config.canBeNull) {
            const { parent } = focus;
            focus.list.removeBlock(focus);
            if (parent.allChildrenAreEmpty) {
                const { list, next } = parent;
                list.removeBlock(parent);
                this.selection.anchorAt(next);
                return;
            }
        }

        this.selection.anchorAt(focus.parent);
    }

    @action
    setFocus(hasFocus: boolean) {
        this._hasFocus = hasFocus;
    }

    @action
    setLastCommand(command: string) {
        if (command) {
            this._lastCommand = command;
        }
    }

    @action
    static createTextRoot(state?: SerializedEditorState) {
        const root = BlockFactory.createBlock('root') as RootBlock;
        const editor = new EditorState(root);
        if (state) {
            editor.applyState(state);
        }
        return new EditorState(root);
    }

    @action
    static createMathRoot(state?: SerializedEditorState): EditorState {
        const root = BlockFactory.createBlock('root:math') as MathRootBlock;
        const editor = new EditorState(root);
        if (state) {
            editor.applyState(state);
        }
        return editor;
    }

    @action
    static fromState(state: SerializedEditorState): EditorState {
        if (state.root.type === 'root:math') {
            return EditorState.createMathRoot(state);
        }
        if (state.root.type === 'root') {
            return EditorState.createTextRoot(state);
        }
        throw new Error('Invalid state object.');
    }

    serialize(): SerializedEditorState {
        return {
            root: this.root.serialize(),
        }
    }
}
