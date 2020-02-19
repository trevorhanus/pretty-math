import { BaseTokenizer, MathSyntaxError, Token, TokenizeResult, TokenName } from '../../../internal';
import { CALCHUB_SYNTAX } from './CalchubSyntax';

const LETTER = /^[a-zA-Z]$/;
const LIT_START = /^(\d|\.)$/;
const LIT_PART = /^(\d|\.)$/;
const OP = /^[\+\=\,\/\*\^\-\!]$/;
const PARENS = /^[\(\{\[\)\}\]]$/;
const VALID_LITERAL = /^(\d*)?(\.\d*)?(?:e-?\d+)?$/;
const WHITE_SPACE = /^\s$/;
const WORD_START = /^[a-zA-Z]$/;
const WORD_PART = /^[a-zA-Z\d_]$/;

export class CalchubTokenizer extends BaseTokenizer {

    constructor() {
        super();
    }

    protected processNextToken(peek: string): void {
        const start = this.pointer + 1;

        // command
        if (peek === '\\') {
            return this.consumeCommand();
        }

        // white space
        if (WHITE_SPACE.test(peek)) {
            const { part, start } = this.consumeRegex(WHITE_SPACE);
            this.tokens.push(new Token(TokenName.Space, part, start));
            return;
        }

        // literal
        if (LIT_START.test(peek)) {
            return this.consumeLiteral();
        }

        // infix op or parens
        if (OP.test(peek) || PARENS.test(peek)) {
            const val = this.nextChar();
            const token = CALCHUB_SYNTAX[val];
            this.tokens.push(new Token(token, val, start));
            return;
        }

        // symbol?
        if (WORD_START.test(peek)) {
            const { part: word } = this.consumeRegex(WORD_PART);
            const token = CALCHUB_SYNTAX[word] || TokenName.Symbol;
            this.tokens.push(new Token(token, word, start));
            return;
        }

        throw new MathSyntaxError(`[parser]: invalid character '${peek}'`);
    }

    private consumeCommand() {
        const start = this.pointer + 1;
        let command = this.nextChar();
        let peek = this.peekAtNext();

        if (peek === '{' || peek === '}') {
            command += this.nextChar();
            const token = CALCHUB_SYNTAX[command];
            this.tokens.push(new Token(token, command, start));
            return;
        }

        const { part } = this.consumeRegex(LETTER);
        command += part;
        const token = CALCHUB_SYNTAX[command];

        if (token == null) {
            throw new MathSyntaxError(`[parser]: unrecognized command '${command}'`);
        }

        this.tokens.push(new Token(token, command, start));
    }

    private consumeLiteral() {
        const start = this.pointer + 1;

        const { part } = this.consumeRegex(LIT_PART);
        let literal = part;

        let peek = this.peekAtNext();

        if (peek === 'e') {
            literal += this.consumeEnotationPart();
        }

        if (!VALID_LITERAL.test(literal)) {
            this.addWarning(`Invalid number '${literal}'`, start, this.pointer);
        }

        this.tokens.push(new Token(TokenName.Literal, literal, start));
    }

    private consumeEnotationPart() {
        let ePart = this.nextChar(); // e
        let peek = this.peekAtNext();

        if (peek === '-') {
            ePart += this.nextChar();
        }

        const { part: digits } = this.consumeRegex(LIT_PART);
        ePart += digits;
        return ePart;
    }

    private consumeRegex(regex: RegExp): { part: string, start: number, end: number } {
        const start = this.pointer + 1;
        let part = '';
        let peek;

        while (true) {
            peek = this.peekAtNext();
            if (peek != null && regex.test(peek)) {
                part += this.nextChar();
            } else {
                break;
            }
        }

        return {
            part,
            start,
            end: this.pointer,
        }
    }

}

export function tokenizeCalchub(calchubExpr: string): TokenizeResult {
    const tokenizer = new CalchubTokenizer();
    return tokenizer.tokenize(calchubExpr);
}
