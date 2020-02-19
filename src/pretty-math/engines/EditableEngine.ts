import { isOr } from 'common';
import { action, computed, observable, reaction } from 'mobx';
import { BaseDecorator } from 'pretty-math/decorator/BaseDecorator';
import {
    Action,
    BlankBlock,
    BlockBuilder,
    Dir,
    History,
    IBlock,
    IDecorator,
    IEventHandler,
    MathFieldState,
    RootBlock,
    Selection
} from 'pretty-math/internal';

export interface InitOptions {
    focusOnMount?: boolean;
    state?: MathFieldState;
    onChange?: (state: MathFieldState) => void;
    onCursorLeave?: (dir: Dir) => void;
    onDeleteOutOf?: (dir: Dir) => void;
}

export abstract class EditableEngine {
    focusOnMount: boolean;
    onCursorLeave: (dir: Dir) => void;
    onDeleteOutOf: (dir: Dir) => void;
    readonly decorator: IDecorator;
    readonly history: History;
    readonly root: RootBlock;
    readonly selection: Selection;
    private _handler: IEventHandler;
    @observable private _hasFocus: boolean;
    private _changeCb: (state: MathFieldState) => void;
    private _disposeChangeReaction: () => void;
    private _fieldRef: HTMLDivElement;
    private _hiddenTextareaRef: HTMLTextAreaElement;

    constructor() {
        this.decorator = new BaseDecorator();
        this.history = new History(this);
        this.root = new RootBlock(this);
        this.selection = new Selection(this);
        this._hasFocus = false;
        this.focusOnMount = false;
    }

    get handler(): IEventHandler {
        return this._handler;
    }

    get fieldRef(): HTMLDivElement {
        return this._fieldRef;
    }

    @computed
    get hasFocus(): boolean {
        return this._hasFocus;
    }

    @computed
    get isInserting(): boolean {
        return this.hasFocus && this.handler.lastAction === Action.Insert;
    }

    @computed
    get lastAction(): Action {
        return this.handler.lastAction;
    }

    get overlayPortalKey(): string {
        return `overlay-portal-${this.root.id}`;
    }

    setHandler(handler: IEventHandler) {
        this._handler = handler;
    }

    @action
    applyState(state: MathFieldState) {
        this.root.applyState(state.root);
        this.selection.applyState(state.selection);
    }

    @action
    blur() {
        this._hiddenTextareaRef && this._hiddenTextareaRef.blur();
    }

    @action
    clear() {
        this.handler.selectAll();
        this.handler.delete();
    }

    @action
    focus() {
        this._hiddenTextareaRef && this._hiddenTextareaRef.focus();
    }

    @action
    focusAtEnd() {
        this.selection.anchorAtEnd();
        this.focus();
    }

    @action
    focusAtStart() {
        this.selection.anchorAtStart();
        this.focus();
    }

    @action
    handleTextareaFocus() {
        if (this.selection.isEmpty) {
            this.handler.moveSelectionToEnd();
        }
        this._hasFocus = true;
        this.handler.resetLastAction();
    }

    @action
    handleTextareaBlur() {
        this._hasFocus = false;
        this.handler.resetLastAction();
    }

    @action
    init(opts: InitOptions) {
        const { state, onChange, onCursorLeave, onDeleteOutOf, focusOnMount } = opts;

        this.focusOnMount = isOr(focusOnMount, false);
        this.onCursorLeave = onCursorLeave;
        this.onDeleteOutOf = onDeleteOutOf;

        // first we need to clear everything out
        this._disposeChangeReaction && this._disposeChangeReaction();
        this._changeCb = null;

        let chain: IBlock = new BlankBlock();
        if (state == null) {
            chain = BlockBuilder.blank();
        }

        if (state != null) {
            chain = BlockBuilder.fromJS(state.root.blocks) || chain;
        }

        this.root.setStartBlock(chain);

        const nextPosition = { block: chain.chainEnd, offset: 1 };

        this._changeCb = onChange;
        this.selection.anchorAt(nextPosition);
        this.startChangeReaction();
        this.history.init();
    }

    kill() {
        this.history.stop();
        this._disposeChangeReaction();
    }

    setFieldRef(div: HTMLDivElement) {
        this._fieldRef = div;
    }

    redo() {
        this.history.redo();
    }

    setHiddenTextareaRef(ref: HTMLTextAreaElement) {
        this._hiddenTextareaRef = ref;
    }

    toJS(): MathFieldState {
        return {
            root: this.root.toRootBlockJS(),
            selection: this.selection.toJS(),
        };
    }

    undo() {
        this.history.undo();
    }

    @action
    private reactToChange() {
        this._changeCb && this._changeCb(this.toJS());
    }

    @action
    private startChangeReaction() {
        this._disposeChangeReaction = reaction(
            () => this.root.toJS(),
            () => this.reactToChange(),
        );
    }
}
