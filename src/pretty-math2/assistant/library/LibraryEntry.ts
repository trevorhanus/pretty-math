import { generateId } from 'common';
import { Editor, SerializedEditorState } from '../../model/Editor';

export interface LibraryEntryConfig {
    // keywords are words that will be used when indexing the entry
    // these are the search terms
    keywords: string[];

    // The category the entry belongs to. The entry will show up
    // under this tab when the Full Library is rendered. If let undefined
    // the entry will not show up in the Full Library but will still
    // be suggested on the keywords.
    category?: string;

    // a description that will be shown to the user for the entry
    description: string;

    // what will be rendered in the assistant
    preview?: SerializedEditorState;

    // the text value to use when
    // rendering the block in pretty math
    text?: string;

    // an optional callback that allows the entry to
    // determine if it should be suggested based on the current
    // state of the engine
    doSuggest?: (editor: Editor) => boolean;

    // required callback that is invoked when the user
    // selects the entry. This callback should modify the editorState
    onSelect: (editor: Editor, entry: LibraryEntry, searchTerm?: string) => void;
}

export class LibraryEntry {
    ref: HTMLLIElement;
    readonly _id: string;
    readonly _config: LibraryEntryConfig;

    constructor(config: LibraryEntryConfig) {
        this._id = generateId();
        this._config = config;
    }

    get id(): string {
        return this._id;
    }

    get category(): string {
        return this._config.category;
    }

    get description(): string {
        return this._config.description;
    }

    get preview(): SerializedEditorState {
        return this._config.preview;
    }

    get keyword(): string {
        return this.keywords.join(' ');
    }

    get keywords(): string[] {
        return this._config.keywords || [];
    }

    doSuggest(editor: Editor): boolean {
        return this._config.doSuggest ? this._config.doSuggest(editor) : true;
    }

    onSelect(editor: Editor, entry: LibraryEntry, searchTerm?: string) {
        this._config.onSelect(editor, entry, searchTerm);
    }

    toDoc(): any {
        return {
            id: this.id,
            keyword: this.keyword,
        }
    }
}
