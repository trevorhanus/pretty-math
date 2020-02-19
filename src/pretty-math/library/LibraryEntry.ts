import { generateId } from 'common';
import { MathExpr } from 'math';
import { BlockBuilder, BlockChainState, BlockType, MathEngine } from 'pretty-math/internal';

export enum EntryType {
    Algebra,
    Calculus,
    Func,
    Greek,
    Trig,
    DefinedVar,
    DefinedFunc,
}

export interface LibraryEntryJS {
    // keywords are words that will be used when indexing the entry
    // these are the search terms
    keywords: string[];

    // a description that will be shown to the user for the entry
    descr: string;

    // what will be rendered in the assistant
    preview?: string;

    // the latex value of the entry
    latex?: string;

    // the text value to use when
    // rendering the block in pretty math
    text?: string;

    // a reference to the expr in the MathContext
    // only be set on DefinedFunc and DefinedVar's
    mathExprRef?: MathExpr;

    // autocomplete is the latex string to be inserted
    // when the user selects the entry from the library
    // it will default to the latex value if it is not set
    autocomplete?: string | BlockChainState;

    // the location of the cursor after the user presses autocomplete
    cursorOnInsert?: { blockPos: string, offset: number };

    // an optional callback that allows the entry to
    // determine if it should be suggested based on the current
    // state of the engine
    doSuggest?: (engine: MathEngine) => boolean;
}

export class LibraryEntry {
    ref: HTMLLIElement;
    private _id: string;
    private _type: EntryType;
    private _js: LibraryEntryJS;

    constructor(type: EntryType, js: LibraryEntryJS) {
        this._id = generateId();
        this._type = type;
        this._js = js;
    }

    get id(): string {
        return this._id;
    }

    get type(): EntryType {
        return this._type;
    }

    get autocomplete(): string | BlockChainState {
        return this._js.autocomplete;
    }

    get cursorOnInsert(): { blockPos: string, offset: number } {
        return this._js.cursorOnInsert;
    }

    get descr(): string {
        return this._js.descr;
    }

    get mathExprRef(): MathExpr {
        return this._js.mathExprRef;
    }

    get preview(): string | BlockChainState {
        return this._js.preview || this._js.autocomplete || this._js.latex || '';
    }

    get keyword(): string {
        return this.keywords.join(' ');
    }

    get keywords(): string[] {
        return this._js.keywords || [];
    }

    get latex(): string {
        return this._js.latex;
    }

    get text(): string {
        return this._js.text;
    }

    doSuggest(engine: MathEngine): boolean {
        if (!engine) {
            return true;
        }

        return this._js.doSuggest ? this._js.doSuggest(engine) : true;
    }

    toDoc(): any {
        return {
            id: this.id,
            keyword: this.keyword,
            latex: this.latex,
        }
    }

    static fromFunc(expr: MathExpr): LibraryEntry {
        if (!expr.isFunctionDefinition) {
            return null;
        }

        const js: LibraryEntryJS = {
            autocomplete: [
                ...BlockBuilder.chainFromString(expr.funcName).toJS(),
                { type: BlockType.LeftParens, text: '(' },
                { type: BlockType.RightParens, text: ')'}
            ],
            cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
            descr: expr.description || 'Defined function.',
            keywords: [expr.funcName],
            mathExprRef: expr,
            preview: `${expr.funcName}(x)`
        };
        return new LibraryEntry(EntryType.DefinedFunc, js);
    }

    static fromVar(expr: MathExpr): LibraryEntry {
        const js: LibraryEntryJS = {
            keywords: [expr.symbol],
            descr: expr.description || 'Defined variable.',
            latex: expr.symbol,
            mathExprRef: expr,
        };
        return new LibraryEntry(EntryType.DefinedVar, js);
    }
}
