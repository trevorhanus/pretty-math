import { action, computed, observable } from 'mobx';
import { Selection } from '../selection/Selection';
import { BlockState, Block } from './Block';
import { BlockList } from './BlockList';
import { RootBlock } from './RootBlock';
import { CursorPosition } from 'pretty-math2/selection/CursorPosition';
import { Dir } from 'pretty-math2/interfaces';

export interface SerializedEditorState {
    root: BlockState;
}

export class EditorState {
    @observable private _hasFocus: boolean;
    readonly root: RootBlock;
    readonly selection: Selection;
    // readonly inlineStyles: InlineStyles;
    // readonly history: History;

    constructor(initialState?: SerializedEditorState) {
        this._hasFocus = false;
        this.root = RootBlock.create(this);
        this.selection = new Selection(this);
        this.applyState(initialState);
    }

    get content(): BlockList {
        return this.root.children.content;
    }

    @computed
    get hasFocus(): boolean {
        return this._hasFocus;
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
        const cursorPosition = focus.block.list.insertRightOfBlock(focus.block, block);
        this.selection.anchorAt(cursorPosition);
    }

    @action
    moveCursor(dir: Dir) {
        const { focus } = this.selection;
        if (dir === Dir.Left) {
            if (focus.block.prev != null) {
                this.selection.anchorAt(new CursorPosition(focus.block.prev, focus.offset));
                return;
            }
            if (focus.offset === 1) {
                this.selection.anchorAt(new CursorPosition(focus.block, 0));
                return;
            }
        }
        if (dir === Dir.Right) {
            if (focus.block.next != null) {
                this.selection.anchorAt(new CursorPosition(focus.block.next, focus.offset));
                return;
            }
            if (focus.offset === 0) {
                this.selection.anchorAt(new CursorPosition(focus.block, 1));
                return;
            }
        }
    }

    @action
    remove() {
        if (!this.selection.isCollapsed) {
            // handle range deletion
        }
        const { focus } = this.selection;
        const cursorPosition = focus.block.list.removeBlock(focus.block);
        this.selection.anchorAt(cursorPosition);
    }

    @action
    setFocus(hasFocus: boolean) {
        this._hasFocus = hasFocus;
    }

    static create(state?: SerializedEditorState) {
        return new EditorState(state);
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
