import { MathSyntaxError, MathWarning, splitUnicodeString, Token, TokenizeResult } from '../../internal';

export abstract class BaseTokenizer {
    protected chars: string[];
    protected warnings: MathWarning[];
    protected pointer: number;
    protected tokens: Token[];

    constructor() {}

    private init() {
        this.chars = null;
        this.pointer = -1;
        this.tokens = [];
        this.warnings = [];
    }

    tokenize(expr: string): TokenizeResult {
        try {
            this.init();
            this.chars = splitUnicodeString(expr);

            let peek = this.peekAtNext();
            while (peek != null) {
                this.processNextToken(peek);
                peek = this.peekAtNext();
            }

            return {
                error: null,
                input: expr,
                tokens: this.tokens,
                warnings: this.warnings,
            };
        } catch (e) {
            if (e instanceof MathSyntaxError) {
                return {
                    error: e,
                    input: expr,
                    tokens: this.tokens,
                    warnings: this.warnings,
                };
            } else {
                throw e;
            }
        }
    }

    protected addWarning(message: string, start?: number, end?: number) {
        this.warnings.push({
            message,
            start,
            end,
        });
    }

    protected abstract processNextToken(peek: string): void;

    protected nextChar(): string {
        this.pointer = this.pointer + 1;
        return this.pointer < this.chars.length
            ? this.chars[this.pointer]
            : null;
    }

    protected peekAtNext(i = 1): string {
        const nextIndex = this.pointer + i;
        return nextIndex < this.chars.length
            ? this.chars.slice(nextIndex, nextIndex + 1)[0]
            : null;
    }
}
