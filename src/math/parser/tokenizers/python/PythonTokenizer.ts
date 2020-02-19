import { BaseTokenizer, Token, TokenizeResult, TokenName } from '../../../internal';
import { PYTHON_SYNTAX } from './PythonSyntax';

export class PythonTokenizer extends BaseTokenizer {

    constructor() {
        super();
    }

    processNextToken(peek: string) {

        let i = 0;
        while (i < families.length) {
            const family = families[i];

            if (isStart(family, peek)) {
                return this.consumeToken(family);
            }

            i++;
        }

        throw new Error(`Invalid character '${peek}'.`);
    }

    private consumeToken(family: TokenFamily) {
        const start = this.pointer;
        let val = this.nextChar();

        let peek = this.peekAtNext();
        while (peek != null && isPart(family, peek)) {
            val += this.nextChar();
            peek = this.peekAtNext();
        }

        let token = PYTHON_SYNTAX[val];

        if (token == null && family === 'word') {
            token = TokenName.Symbol;
        }

        if (token == null && family === 'literal') {
            token = TokenName.Literal;
        }

        if (token == null && family === 'white_space') {
            token = TokenName.Space;
        }

        if (token == null) {
            throw new Error(`Invalid token '${val}'.`);
        }

        this.tokens.push(new Token(token, val, start));
    }

}

type TokenFamily = 'operator' | 'literal' | 'white_space' | 'word';

function isStart(family: TokenFamily, c: string): boolean {
    const familyConfig = familyMap[family];
    return familyConfig.START.test(c);
}

function isPart(family: TokenFamily, c: string): boolean {
    const familyConfig = familyMap[family];
    return familyConfig.PART.test(c);
}

const familyMap = {
    'operator': {
        START: /^[\+\=\,\/\*\-]$/,
        PART: /^[\*]$/,
    },
    'literal': {
        START: /^[\d|\.]$/,
        PART: /^[\d|\.]$/,
    },
    'white_space': {
        START: /^[\s]$/,
        PART: /^[\s]$/,
    },
    'word': {
        START: /^[a-zA-Z]$/,
        PART: /^[a-zA-Z]$/,
    },
    'parens': {
        START: /^[\(\)]$/,
        PART: /a^/, // no match, since parens are always one char
    }
};

const families = Object.keys(familyMap) as TokenFamily[];

export function tokenizePython(python: string): TokenizeResult {
    const tokenizer = new PythonTokenizer();
    return tokenizer.tokenize(python);
}
