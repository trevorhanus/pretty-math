import { INode } from 'math';
import { action, computed, observable, reaction } from 'mobx';
import { AssistantLibrary, BlockUtils, MathEngine } from 'pretty-math/internal';

export enum Force {
    None,
    Open,
    Close,
}

export class AssistantStore {
    readonly engine: MathEngine;
    readonly library: AssistantLibrary;
    @observable.ref private _focusedNode: INode;
    @observable private _force: Force;

    constructor(engine: MathEngine) {
        this.engine = engine;
        this.library = new AssistantLibrary(engine);
        this._focusedNode = engine.selection.focusedNode;
        this.setupFocusedTokenReaction();
    }

    @action
    private setupFocusedTokenReaction() {
        const { selection } = this.engine;
        reaction(
            () => selection.focusedNode,
            (node: INode) => {
                if (this._focusedNode !== node) {
                    this._force = Force.None;
                }

                this._focusedNode = node;
            },
            {
                delay: 20,
            }
        );
    }

    @computed
    get doShow(): boolean {
        const { engine } = this;

        switch (true) {

            case this._force === Force.Close:
                return false;

            case this._force === Force.Open:
                return true;

            case !engine.selection.isCollapsed:
            case !engine.isInserting:
            case this.library.suggestedEntries.length === 0:
                return false;

            default:
                return true;
        }
    }

    @computed
    get focusedNode(): INode {
        return this._focusedNode;
    }

    @action
    forceOpenLibrary() {
        this.library.forceOpen();
    }

    @action
    forceClose() {
        this._force = Force.Close;
    }

    @action
    forceOpen() {
        this._force = Force.Open;
    }

    @action
    handleEscape(e: KeyboardEvent) {
        if (this.doShow) {
            e.stopPropagation();
            e.preventDefault();
            this.forceClose();
        }
    }

    @action
    handleReturn(e: KeyboardEvent) {
        e.stopPropagation();
        e.preventDefault();

        if (this.library.isMounted && this.library.focusedEntry) {
            const entry = this.library.focusedEntry;
            BlockUtils.replaceFocusedTokenWithLibraryEntry(this.engine.selection, entry);
            this.forceClose();
            return;
        }

        if (this.library.isMounted) {
            this.forceClose();
        }
    }

    @action
    handleTab(e: KeyboardEvent) {
        if (this.doShow) {
            e.stopPropagation();
            e.preventDefault();
        }

        if (this.library.isMounted) {
            const direction = e.shiftKey ? -1 : 1;
            this.library.activateNextTab(direction);
        }
    }

    @action
    handleDown(e: KeyboardEvent) {
        if (this.library.isMounted && this.library.libraryEntriesToRender.length > 0) {
            e.stopPropagation();
            e.preventDefault();
            this.library.moveIndex(1);
        }
    }

    @action
    handleUp(e: KeyboardEvent) {
        if (this.library.isMounted && this.library.libraryEntriesToRender.length > 0 && this.library.focusedIndex > -1) {
            e.stopPropagation();
            e.preventDefault();
            this.library.moveIndex(-1);
        }
    }

    @action
    reset() {
        this.library.reset();
        this._force = Force.None;
    }
}
