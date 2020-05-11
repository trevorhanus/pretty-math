import elasticlunr from 'elasticlunr';
import {
    Editor,
    LibraryEntry,
    mathEntries,
} from 'pretty-math2/internal';

elasticlunr.clearStopWords();

export interface LibrarySearchItem {
    entry: LibraryEntry;
    score?: number;
    searchTerm?: string;
}

export class Library {
    private _categories: Map<string, LibrarySearchItem[]>;
    private _entries: Map<string, LibraryEntry>;
    private _index: any;

    constructor() {
        this._categories = new Map<string, LibrarySearchItem[]>();
        this._entries = new Map<string, LibraryEntry>();

        this._index = elasticlunr();
        this._index.addField('keyword');
        this._index.setRef('id');
    }

    get allEntries(): LibrarySearchItem[] {
        return reduceIterator(this._entries.values(), entry => {
            return {
                entry,
            }
        });
    }

    get categories(): string[] {
        return Array.from(this._categories.keys());
    }

    getCategoryList(category: string): LibrarySearchItem[] {
        if (!this._categories.has(category)) {
            this._categories.set(category, []);
        }
        return this._categories.get(category);
    }

    getSuggested(phrase: string, editorState: Editor): LibrarySearchItem[] {
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
            categoryList.push({ entry });
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

    search(term: string, keepCb?: (entry: LibraryEntry) => boolean): LibrarySearchItem[] {
        const terms = expandTerm(term);

        const config = {
            bool: 'OR',
            expand: true,
        };

        keepCb = keepCb || (() => true);

        // store a map of hits
        // { ref, term, score, entry }
        const hits: { [ref: string]: LibrarySearchItem } = {};

        terms.forEach(term => {
            this._index.search(term, config).forEach(hit => {
                const { ref } = hit;

                if (hits[ref]) {
                    return;
                }

                const entry = this._entries.get(ref);

                if (entry && keepCb(entry)) {
                    hits[ref] = {
                        entry,
                        score: hit.score,
                        searchTerm: term,
                    }
                }
            });
        });

        return Object.keys(hits).map(ref => hits[ref]);
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

// foo => [foo, oo, o]
function expandTerm(term: string): string[] {
    if (!term) {
        return [];
    }

    const terms = [];
    let i = 0;
    while (i < term.length) {
        terms.push(term.slice(i));
        i++;
    }

    return terms;
}

function reduceIterator<T, R>(iterator: IterableIterator<T>, cb: (item: T) => R): R[] {
    const items: R[] = [];
    let next = iterator.next();
    while (next) {
        items.push(cb(next.value));
        next = iterator.next();
    }
    return items;
}

let mathLibrary = null;
export function getMathLibrary(): Library {
    if (!mathLibrary) {
        mathLibrary = new Library();
        mathEntries.forEach(config => mathLibrary.addEntry(new LibraryEntry(config)));
    }
    return mathLibrary;
}
