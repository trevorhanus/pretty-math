import { action, computed, observable } from 'mobx';
import { AssistantStore } from '../assistant/stores/AssistantStore';
import { BlockFactory } from '../blocks/BlockFactory';
import { Selection } from '../selection/Selection';
import { BlockState, Block } from './Block';
import { BlockList } from './BlockList';
import { RootBlock } from './RootBlock';
import { Dir } from 'pretty-math2/interfaces';
import { getNextCursorPosition } from 'pretty-math2/selection/CursorPositioner';

export interface SerializedEditorState {
    root: BlockState;
}

export class EditorState {
    @observable private _hasFocus: boolean;
    @observable private _lastCommand: string;
    readonly assistant: AssistantStore;
    readonly root: RootBlock;
    readonly selection: Selection;
    // readonly inlineStyles: InlineStyles;
    // readonly history: History;

    constructor(rootBlock: RootBlock, initialState?: SerializedEditorState) {
        this._hasFocus = false;
        this._lastCommand = null;
        this.assistant = new AssistantStore();
        this.root = rootBlock;
        this.root.setEditor(this);
        this.selection = new Selection(this);
        this.applyState(initialState);
    }

    get inner(): BlockList {
        return this.root.children.inner;
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

        this.root.applyJS(state.root);
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
                this.selection.anchorAt(this.selection.selectedRange.start);
                return;
            }
            if (dir === Dir.Right) {
                this.selection.anchorAt(this.selection.selectedRange.end);
                return;
            }
            this.selection.anchorAt(this.selection.focus);
        }
        const { focus } = this.selection;
        this.selection.anchorAt(getNextCursorPosition(focus, dir));
    }

    @action
    moveSelectionFocus(dir: Dir) {
        const { focus } = this.selection;
        this.selection.focusAt(getNextCursorPosition(focus, dir));
    }

    @action
    remove() {
        if (!this.selection.isCollapsed) {
            // handle range deletion
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
            if (parent.childrenAreEmtpy) {
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

    static create() {
        const root = BlockFactory.createRootBlock('root');
        return new EditorState(root);
    }

    static createMathRoot(): EditorState {
        const root = BlockFactory.createRootBlock('root:math');
        return new EditorState(root);
    }

    static fromState(state: SerializedEditorState): EditorState {
        const root = BlockFactory.createBlockFromState(state.root) as RootBlock;
        return new EditorState(root, state);
    }

    serialize(): SerializedEditorState {
        return {
            root: this.root.toJS(),
        }
    }
}
