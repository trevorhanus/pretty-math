import { action, computed, observable, reaction } from 'mobx';
import { between, scrollIntoView } from '../../../common';
import { EditorState } from '../../model/EditorState';
import { SelectionRange } from '../../selection/SelectionRange';
import { getMathLibrary, Library } from '../library/Library';
import { LibraryEntry } from '../library/LibraryEntry';

export enum AssistantForce {
    Open,
    Closed,
}

const mathLibrary = getMathLibrary();
const unitsLibrary = null;
const textLibrary = null;

export class AssistantStore {
    readonly editor: EditorState;
    @observable private _entryIndex: number;
    @observable private _force: AssistantForce;
    @observable private _fullLibrary: boolean;
    @observable private _categoryIndex: number;

    constructor(editor: EditorState) {
        this.editor = editor;
        this._entryIndex = -1;
        this._force = null;
        this._fullLibrary = false;
        this._categoryIndex = 0;
        reaction(
            () => this.editor.lastCommand,
            command => {
                if (command !== 'force_assistant_open' && command !== 'force_assistant_closed') {
                    this.reset();
                }
            }
        );
    }

    @computed
    get categories(): string[] {
        return this.library.categories;
    }

    @computed
    get entriesUnderFocusedCategory(): LibraryEntry[] {
        return this.library.getCategoryList(this.focusedCategory);
    }

    @computed
    get entriesToRender(): LibraryEntry[] {
        if (this.fullLibrary) {
            return this.entriesUnderFocusedCategory;
        } else {
            return this.suggestions;
        }
    }

    @computed
    get entryIndex(): number {
        return this._entryIndex;
    }

    @computed
    get focusedCategory(): string {
        return this.categories[this._categoryIndex];
    }

    @computed
    get focusedEntry(): LibraryEntry {
        return this.entriesToRender[this._entryIndex];
    }

    @computed
    get force(): AssistantForce {
        return this._force;
    }

    @computed
    get fullLibrary(): boolean {
        return this._fullLibrary;
    }

    @computed
    get library(): Library {
        switch (this.editor.mode) {
            case 'math':
                return mathLibrary;

            case 'text':
                return textLibrary;

            case 'units':
                return unitsLibrary;

            default:
                return null;
        }
    }

    @computed
    get suggestions(): LibraryEntry[] {
        const phrase = rangeToCalchub(this.editor.selection.trailingPhraseRange);
        console.log(`phrase: ${phrase}`);
        return phrase ? this.library.getSuggested(phrase, this.editor) : [];
    }

    @computed
    get tabs(): string[] {
        return this.library.categories;
    }

    isFocused(i: number): boolean {
        return this._entryIndex === i;
    }

    isFocusedCategory(category: string): boolean {
        const index = this.categories.indexOf(category);
        return this._categoryIndex === index;
    }

    @action
    focusCategory(category: string) {
        const index = this.categories.indexOf(category);
        if (index > -1) {
            this._categoryIndex = index;
        }
    }

    @action
    forceOpen() {
        this._force = AssistantForce.Open;
        this._fullLibrary = true;
        this._entryIndex = 0;
    }

    @action
    forceClosed() {
        this._force = AssistantForce.Closed;
    }

    @action
    moveFocus(inc: number): boolean {
        const oldIndex = this._entryIndex;
        const nextIndex = oldIndex + inc;
        this._entryIndex = between(-1, Math.max(0, this.entriesToRender.length - 1), nextIndex);
        if (this.focusedEntry) {
            scrollIntoView(this.focusedEntry.ref, { block: 'nearest', paddingBottom: 50 });
        }
        return this._entryIndex !== oldIndex;
    }

    @action
    nextTab(inc: number) {
        const oldIndex = this._categoryIndex;
        let nextIndex = this._categoryIndex + inc;
        if (nextIndex === this.categories.length) {
            nextIndex = 0;
        }
        if (nextIndex < 0) {
            nextIndex = this.categories.length - 1;
        }
        this._categoryIndex = nextIndex;
        if (this._categoryIndex !== oldIndex) {
            this._entryIndex = 0;
        }
    }

    @action
    releaseForce() {
        this._force = null;
    }

    @action
    reset() {
        this._entryIndex = -1;
        this._force = null;
        this._fullLibrary = false;
        this._categoryIndex = 0;
    }

    @action
    showFullLibrary() {
        this._fullLibrary = true;
    }
}

function rangeToCalchub(range: SelectionRange): string {
    if (range.isEmpty) {
        return '';
    }

    let text = '';
    let block = range.start;

    while (block) {
        text += block.toCalchub().text;
        if (block === range.end) {
            return text;
        } else {
            block = block.next;
        }
    }

    return text;
}
