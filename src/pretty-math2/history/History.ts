import isEqual from 'lodash.isequal';
import { action, computed, IObservableArray, observable, reaction } from 'mobx';
import type { Editor, SerializedEditorState } from 'pretty-math2/internal';

export class History {
    readonly editor: Editor;
    private _disposeReaction: () => void;
    private _internalChange: boolean;
    private _prevState: SerializedEditorState;
    private _redoStack: IObservableArray<SerializedEditorState>;
    private _undoStack: IObservableArray<SerializedEditorState>;

    constructor(editor: Editor) {
        this.editor = editor;
        this._internalChange = false;
        this._undoStack = observable.array<SerializedEditorState>([], { deep: false });
        this._redoStack = observable.array<SerializedEditorState>([], { deep: false });
    }

    @computed
    get canRedo(): boolean {
        return this._redoStack.length > 0;
    }

    @computed
    get canUndo(): boolean {
        return this._undoStack.length > 0;
    }

    @action
    dispose() {
        this._disposeReaction && this._disposeReaction();
    }

    @action
    init() {
        this._disposeReaction && this._disposeReaction();
        this._undoStack.clear();
        this._redoStack.clear();

        this._disposeReaction = reaction(
            () => this.editor.serialize(),
            () => this.recordChange(),
            {
                fireImmediately: false,
                equals: (prev: SerializedEditorState, next: SerializedEditorState) => {
                    this._prevState = prev;

                    if (this._internalChange) {
                        this._internalChange = false;
                        return true;
                    }

                    return isEqual(prev.root, next.root);
                }
            }
        )
    }

    @action
    recordChange() {
        this._redoStack.clear();
        this._undoStack.push(this._prevState);
    }

    @action
    redo() {
        if (!this.canRedo) {
            return;
        }

        // put the current state on undo stack
        this._undoStack.push(this.editor.serialize());

        // pop off the top redo state
        const state = this._redoStack.pop();

        // set this so our reaction doesn't push
        // the change to our undo stack
        this._internalChange = true;

        this.editor.applyState(state);
    }

    @action
    undo() {
        if (!this.canUndo) {
            return;
        }

        // put the current state on redo
        this._redoStack.push(this.editor.serialize());

        // pop off top undo state
        const prevState = this._undoStack.pop();

        // set this so our reaction doesn't push
        // the change to our undo stack
        this._internalChange = true;

        this.editor.applyState(prevState);
    }
}
