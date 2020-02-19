import { between, scrollIntoView } from 'common';
import { INode, isSymbolFam } from 'math';
import { action, computed, observable, when } from 'mobx';
import { EntryType, Force, Library, LibraryEntry, MathEngine } from 'pretty-math/internal';

export enum LibraryTab {
    Suggested = 'suggested',
    Vars = 'vars',
    Trig = 'trig',
    Functions = 'functions',
    Greek = 'greek',
}

export enum ViewState {
    SuggestionsOnly,
    FullLibrary,
}

export class AssistantLibrary {
    engine: MathEngine;
    private _disposeReactionWhenFocusedTokenValueChanges: () => void;
    @observable private _isMounted: boolean;
    @observable private _forced: Force;
    @observable private _activeTab: LibraryTab;
    @observable private _focusedIndex: number;
    @observable private _viewState: ViewState;

    constructor(engine: MathEngine) {
        this.engine = engine;
        this._isMounted = false;
        this._activeTab = LibraryTab.Suggested;
        this._focusedIndex = -1;
        this._viewState = ViewState.SuggestionsOnly;
    }

    @computed
    get activeTab(): LibraryTab {
        return this._activeTab;
    }

    @computed
    get focusedEntry(): LibraryEntry {
        const i = this._focusedIndex;
        const entries = this.libraryEntriesToRender;

        if (i < 0 || i > entries.length) {
            return null;
        } else {
            return entries[i];
        }
    }

    @computed
    get focusedIndex(): number {
        return this._focusedIndex;
    }

    @computed
    get isMounted(): boolean {
        return this._isMounted;
    }

    get library(): Library {
        return this.engine.library;
    }

    @computed
    get suggestedEntries(): LibraryEntry[] {
        const { focusedNode } = this.engine.selection;

        if (!focusedNode) {
            return [];
        }

        const libraryMatches = this.library.getSuggested(focusedNode, this.engine);

        return libraryMatches.filter(entry => {
            return entry.latex !== focusedNode.tokenValue;
        });
    }

    @computed
    get libraryEntriesToRender(): LibraryEntry[] {
        if (this.viewState === ViewState.SuggestionsOnly) {
            return this.suggestedEntries;
        }

        switch (this.activeTab) {

            case LibraryTab.Suggested:
                return this.suggestedEntries;

            case LibraryTab.Vars:
                return this.library.entriesDefinedInCxt;

            case LibraryTab.Trig:
                return this.library.trig;

            case LibraryTab.Functions:
                return this.getFunctionEntries();

            case LibraryTab.Greek:
                return this.library.greeks;

            default:
                return [];
        }
    }

    @computed
    get tabsToRender(): LibraryTab[] {
        const tabs = [
            LibraryTab.Suggested,
            LibraryTab.Trig,
            LibraryTab.Functions,
            LibraryTab.Greek,
        ];

        if (this.engine.mathContext) {
            tabs.splice(1, 0, LibraryTab.Vars);
        }

        return tabs;
    }

    @computed
    get viewState(): ViewState {
        return this._viewState;
    }

    private buildDefineFunctionEntry(node: INode): LibraryEntry {
        if (node == null || !isSymbolFam(node)) {
            return null;
        }

        const term = node.tokenValue;

        new LibraryEntry(EntryType.Func, {
            keywords: [],
            descr: `Define function ${term}(x)`,
            latex: `\\dfunc`,
            autocomplete: `\\dfunc{${term},}`,
            cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
        });
    }

    getFunctionEntries(): LibraryEntry[] {
        const entries: LibraryEntry[] = this.library.funcs.slice();
        const defineFuncEntry = this.buildDefineFunctionEntry(this.engine.assistant.focusedNode);

        if (defineFuncEntry) {
            entries.unshift(defineFuncEntry);
        }

        return entries;
    }

    indexIsFocused(i: number): boolean {
        return this._focusedIndex === i;
    }

    @action
    activateNextTab(inc: number = 1) {
        const { activeTab } = this;
        const tabs = this.tabsToRender;
        const activeIndex = tabs.indexOf(activeTab);
        let next = activeIndex + inc;
        if (next >= tabs.length) {
            next = 0;
        }

        if (next < 0) {
            next = tabs.length - 1;
        }

        this.activateTab(tabs[next]);
    }

    @action
    activateTab(tab: LibraryTab) {
        if (this._activeTab !== tab) {
            this._activeTab = tab;
            this._focusedIndex = 0;
        }
    }

    @action
    close() {
        this._forced = Force.None;
    }

    @action
    forceClose() {
        this._disposeFocusedTokenReaction();
        this._forced = Force.Close;
        // release the force when the focused token changes
        const tokenValue = this.engine.selection.focusedNodeTokenValue;
        this.releaseForceWhenFocusedTokenValueChanges(tokenValue);
    }

    @action
    forceOpen() {
        this._disposeFocusedTokenReaction();
        this._forced = Force.Open;
        // release the force when the focused token changes
        const tokenValue = this.engine.selection.focusedNodeTokenValue;
        this.releaseForceWhenFocusedTokenValueChanges(tokenValue);

        this.pickTab();
    }

    @action
    handleMount() {
        this._isMounted = true;
        this._focusedIndex = -1;
    }

    @action
    handleUnmount() {
        this._isMounted = false;
        this._activeTab = LibraryTab.Suggested;
        this._viewState = ViewState.SuggestionsOnly;
    }

    @action
    moveIndex(inc = 1) {
        let nextIndex = this._focusedIndex + inc;
        nextIndex = between(-1, Math.max(0, this.libraryEntriesToRender.length - 1), nextIndex);
        this._focusedIndex = nextIndex;
        if (this.focusedEntry) {
            scrollIntoView(this.focusedEntry.ref, { block: 'nearest' });
        }
    }

    @action
    pickTab() {
        if (this.suggestedEntries.length !== 0) {
            this.activateTab(LibraryTab.Suggested);
            return;
        }
        if (this.engine.mathContext.vars.length !== 0 || this.engine.mathContext.funcs.length !== 0) {
            this.activateTab(LibraryTab.Vars);
            return;
        }
        this.activateTab(LibraryTab.Trig);
    }

    @action
    reset() {
        this._focusedIndex = -1;
        this._forced = Force.None;
        this._activeTab = LibraryTab.Suggested;
        this._disposeFocusedTokenReaction();
    }

    @action
    setViewState(viewState: ViewState) {
        if (viewState === ViewState.FullLibrary) {
            this.pickTab();
        }

        this._viewState = viewState;
    }

    @action
    toggleFullLibrary() {
        const nextViewState = this._viewState === ViewState.SuggestionsOnly ? ViewState.FullLibrary : ViewState.SuggestionsOnly;
        this.setViewState(nextViewState);
    }

    private releaseForceWhenFocusedTokenValueChanges(target: string) {
        this._disposeReactionWhenFocusedTokenValueChanges = when(
            () => this.engine.selection.focusedNodeTokenValue !== target,
            () => {
                this._forced = Force.None;
            }
        );
    }

    private _disposeFocusedTokenReaction() {
        this._disposeReactionWhenFocusedTokenValueChanges && this._disposeReactionWhenFocusedTokenValueChanges();
    }
}
