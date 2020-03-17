import isEqual from 'lodash.isequal';
import { action, computed, IObservableArray, observable, reaction } from 'mobx';
import { EditableEngine, MathFieldState } from 'pretty-math/internal';

export class History {
    private _engine: EditableEngine;
    private _undoStack: IObservableArray<MathFieldState>;
    private _redoStack: IObservableArray<MathFieldState>;
    private _disposeReaction: () => void;
    private _inUndo: boolean;
    private _inRedo: boolean;
    private _prevState: MathFieldState;

    constructor(engine: EditableEngine) {
        this._engine = engine;
        this._undoStack = observable.array<MathFieldState>([], { deep: false });
        this._redoStack = observable.array<MathFieldState>([], { deep: false });
        this._inUndo = false;
        this._inRedo = false;
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
    init() {
        this._disposeReaction && this._disposeReaction();
        this._undoStack.clear();
        this._redoStack.clear();

        this._prevState = this._engine.toJS();

        this._disposeReaction = reaction(
            () => this._engine.toJS(),
            () => {
                this.recordStateChange();
            },
            {
                fireImmediately: false,
                equals: (prev: MathFieldState, next: MathFieldState) => {
                    // always update our prev state here
                    this._prevState = prev;
                    return isEqual(prev.root, next.root);
                }
            }
        );
    }

    undo() {
        if (!this.canUndo) {
            return;
        }

        this._inUndo = true;

        // pull off top undo state
        const state = this._undoStack.shift();

        // apply state to engine
        // this will trigger a reaction
        this._engine.applyState(state);

        this._inUndo = false;
    }

    redo() {
        if (!this.canRedo) {
            return;
        }

        this._inRedo = true;

        // pull off the top redo
        const state = this._redoStack.shift();

        // apply state to engine
        // this will trigger a reaction
        // which will set the _currentState
        this._engine.applyState(state);

        this._inRedo = false;
    }

    @action
    stop() {
        this._undoStack.clear();
        this._redoStack.clear();
        this._disposeReaction();
    }

    @action
    recordStateChange() {
        if (this._inUndo) {
            // push the prev state to the redo stack
            this._redoStack.unshift(this._prevState);
            return;
        }

        if (this._inRedo) {
            this._undoStack.unshift(this._prevState);
            return;
        }

        this._redoStack.clear();
        this._undoStack.unshift(this._prevState);
    }
}
