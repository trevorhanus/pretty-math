import elasticlunr from 'elasticlunr';
import { EditorState } from '../../model/EditorState';
import { LibraryEntry } from './LibraryEntry';
import { mathEntries } from '../math.entries';

elasticlunr.clearStopWords();

export class Library {
    private _categories: Map<string, LibraryEntry[]>;
    private _entries: Map<string, LibraryEntry>;
    private _index: any;

    constructor() {
        this._categories = new Map<string, LibraryEntry[]>();
        this._entries = new Map<string, LibraryEntry>();

        this._index = elasticlunr();
        this._index.addField('keyword');
        this._index.setRef('id');
    }

    get allEntries(): LibraryEntry[] {
        return Array.from(this._entries.values());
    }

    get categories(): string[] {
        return Array.from(this._categories.keys());
    }

    getCategoryList(category: string): LibraryEntry[] {
        if (!this._categories.has(category)) {
            this._categories.set(category, []);
        }
        return this._categories.get(category);
    }

    getSuggested(phrase: string, editorState: EditorState): LibraryEntry[] {
        return this.search(phrase, entry => {
            return entry.doSuggest(editorState);
        });
    }

    addEntry(entry: LibraryEntry) {
        if (!entry) {
            return;
        }

        this._index.addDoc(entry.toDoc());
        this._entries.set(entry.id, entry);
        if (entry.category) {
            const categoryList = this.getCategoryList(entry.category);
            categoryList.push(entry);
        }
    }

    libraryEntryWithExactKeyword(keyword: string): LibraryEntry {
        let entryWithKeyword = null;
        this._entries.forEach((entry) => {
            if (entry.keywords.includes(keyword)) {
                entryWithKeyword = entry;
            }
        });
        return entryWithKeyword;
    }

    removeEntryById(id: string) {
        const entry = this._entries.get(id);
        if (entry) {
            this._index.removeDoc(entry.toDoc());
            this._entries.delete(id);
        }
    }

    search(term: string, keepCb?: (entry: LibraryEntry) => boolean): LibraryEntry[] {
        const config = {
            bool: 'OR',
            expand: true,
        };

        keepCb = keepCb || (() => true);

        return this._index.search(term, config).reduce((entries, { ref }) => {
            const entry = this._entries.get(ref);
            if (entry && keepCb(entry)) {
                entries.push(entry);
            }
            return entries;
        }, []);
    }

    private termIsADefinedKeyword(term: string): boolean {
        let found = false;
        this._entries.forEach(entry => {
            if (!found) {
                found = entry.keywords.includes(term);
            }
        });
        return found;
    }
}

let mathLibrary = null;
export function getMathLibrary(): Library {
    if (!mathLibrary) {
        mathLibrary = new Library();
        mathEntries.forEach(config => mathLibrary.addEntry(new LibraryEntry(config)));
    }
    return mathLibrary;
}
