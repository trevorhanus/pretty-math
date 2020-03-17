import { action, computed, observable } from 'mobx';
import { Selection } from '../selection/Selection';
import { BlockState } from './Block';
import { BlockList } from './BlockList';
import { RootBlock } from './RootBlock';

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
