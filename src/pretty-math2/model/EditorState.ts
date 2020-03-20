import { action, computed, observable } from 'mobx';
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
    readonly root: RootBlock;
    readonly selection: Selection;
    // readonly inlineStyles: InlineStyles;
    // readonly history: History;

    constructor(rootBlock: RootBlock, initialState?: SerializedEditorState) {
        this._hasFocus = false;
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

    static create(state?: SerializedEditorState) {
        return new EditorState(RootBlock.create(), state);
    }

    static createMathRoot(state?: SerializedEditorState): EditorState {
        return new EditorState(RootBlock.createMathRoot(), state);
    }

    serialize(): SerializedEditorState {
        return {
            root: this.root.toJS(),
        }
    }
}

const editorState = {
    root: {
        id: '1s3qw',
        type: 'root',
        data: {},
        children: {
            content: [
                {
                    id: '9wvp3',
                    type: 'char',
                    data: {
                        text: 'a',
                    }
                },
                {
                    id: '24n8s',
                    type: 'char',
                    data: {
                        text: ' ',
                    }
                },
                {
                    id: '120as',
                    type: 'math:root',
                    data: {},
                    children: {
                        content: [
                            {
                                id: '3',
                                type: 'math:greek',
                                data: {
                                    text: 'α',
                                }
                            },
                            {
                                id: '3',
                                type: 'math:char',
                                data: {
                                    text: '=',
                                }
                            },
                            {
                                id: '3',
                                type: 'math:radical',
                                data: {},
                                children: {
                                    inner: [

                                    ]
                                }
                            }
                        ]
                    }

                }
            ]
        }
    },
    inlineStyles: [
        {
            start: '0.1:1',
            end: '0.1:3',
            style: {
                color: 'red',
            }
        }
    ],
    selection: {
        anchor: '0.1:2',
        focus: '0.1:2',
    },
};
