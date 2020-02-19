import elasticlunr from 'elasticlunr';
import {
    DefineFnEvent,
    DefineVarEvent,
    DeleteFnEvent,
    DeleteVarEvent,
    EventType,
    MathContext
} from 'math';
import { INode, isSymbolNode } from 'math';
import {
    ALGEBRA,
    CALCULUS,
    EntryType,
    FUNCTIONS,
    GREEK_SYMBOLS,
    LibraryEntry,
    LINEAR_ALGEBRA,
    MathEngine,
    TRIG
} from 'pretty-math/internal';

elasticlunr.clearStopWords();

export class Library {
    private _entries: Map<string, LibraryEntry>;
    private _exprToEntryMap: Map<string, LibraryEntry>;
    private _index: any;
    private _mathCxt: MathContext;

    constructor(mathCxt?: MathContext) {
        this._entries = new Map<string, LibraryEntry>();
        this._exprToEntryMap = new Map<string, LibraryEntry>();
        this._mathCxt = mathCxt;

        this._index = elasticlunr();
        this._index.addField('keyword');
        this._index.setRef('id');

        ALGEBRA.forEach(entryJS => {
            this.addEntry(new LibraryEntry(EntryType.Algebra, entryJS));
        });

        CALCULUS.forEach(entryJS => {
            this.addEntry(new LibraryEntry(EntryType.Calculus, entryJS));
        });

        FUNCTIONS.forEach(entryJS => {
            this.addEntry(new LibraryEntry(EntryType.Func, entryJS));
        });

        GREEK_SYMBOLS.forEach(entryJS => {
            this.addEntry(new LibraryEntry(EntryType.Greek, entryJS));
        });

        LINEAR_ALGEBRA.forEach(entryJs => {
            this.addEntry(new LibraryEntry(EntryType.Algebra, entryJs));
        });

        TRIG.forEach(entryJS => {
            this.addEntry(new LibraryEntry(EntryType.Trig, entryJS));
        });

        if (this._mathCxt) {
            this.updateOnVarAndFuncChange();
        }
    }

    get allEntries(): LibraryEntry[] {
        return Array.from(this._entries.values());
    }

    get funcs(): LibraryEntry[] {
        return Array.from(this._entries.values()).filter(entry => entry.type === EntryType.Func);
    }

    get greeks(): LibraryEntry[] {
        return Array.from(this._entries.values()).filter(entry => entry.type === EntryType.Greek);
    }

    get trig(): LibraryEntry[] {
        return Array.from(this._entries.values()).filter(entry => entry.type === EntryType.Trig);
    }

    get entriesDefinedInCxt(): LibraryEntry[] {
        return Array.from(this._entries.values()).filter(entry => {
            return entry.type === EntryType.DefinedVar || entry.type === EntryType.DefinedFunc;
        });
    }

    getEntryByLatex(latex: string): LibraryEntry {
        return Array.from(this._entries.values()).find(entry => entry.latex === latex);
    }

    getSuggested(node: INode, engine?: MathEngine): LibraryEntry[] {
        const entries = [];

        const term = node.tokenValue;

        // start with the focused token
        entries.push(new LibraryEntry(EntryType.DefinedVar, {
            keywords: [],
            descr: 'The currently focused token',
            latex: term,
            autocomplete: term,
        }));

        // add a define function entry
        if (node.tokenStart === 0 && isSymbolNode(node) && !this.termIsADefinedKeyword(term)) {
            entries.push(new LibraryEntry(EntryType.Func, {
                keywords: [],
                descr: `Define function ${term}(x)`,
                preview: `\\dfunc{${term},x}=x`,
                latex: `\\dfunc`,
                autocomplete: `\\dfunc{${term},}`,
                cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
            }));
        }

        entries.push(...this.search(term, engine));
        return entries;
    }

    addEntry(entry: LibraryEntry) {
        if (!entry) {
            return;
        }

        this._index.addDoc(entry.toDoc());
        this._entries.set(entry.id, entry);
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

    search(term: string, engine?: MathEngine): LibraryEntry[] {
        const config = {
            bool: 'OR',
            expand: true,
        };

        return this._index.search(term, config).reduce((entries, { ref }) => {
            const entry = this._entries.get(ref);

            let suggest = true;

            if (engine) {
                suggest = entry.doSuggest(engine);
            }

            if (suggest) {
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

    private updateOnVarAndFuncChange() {
        this._mathCxt.bus.addListener(EventType.DefineVar, this.handleDefineVar);
        this._mathCxt.bus.addListener(EventType.DefineFn, this.handleDefineFn);
        this._mathCxt.bus.addListener(EventType.DeleteVar, this.handleDelete);
        this._mathCxt.bus.addListener(EventType.DeleteFn, this.handleDelete);
    }

    private handleDefineVar = (e: DefineVarEvent) => {
        setTimeout(() => {
            const expr = this._mathCxt.getExprById(e.exprId);
            if (expr) {
                const entry = LibraryEntry.fromVar(expr);
                this.addEntry(entry);
                this._exprToEntryMap.set(e.exprId, entry);
            }
        });
    };

    private handleDefineFn = (e: DefineFnEvent) => {
        setTimeout(() => {
            const expr = this._mathCxt.getExprById(e.exprId);
            if (expr) {
                const entry = LibraryEntry.fromFunc(expr);
                this.addEntry(entry);
                this._exprToEntryMap.set(e.exprId, entry);
            }
        });
    };

    private handleDelete = (e: DeleteVarEvent | DeleteFnEvent) => {
        const entry = this._exprToEntryMap.get(e.exprId);
        if (entry) {
            this.removeEntryById(entry.id);
            this._exprToEntryMap.delete(e.exprId);
        }
    };
}

let library = null;
export function getLibrary(): Library {
    if (!library) {
        library = new Library();
    }

    return library;
}
