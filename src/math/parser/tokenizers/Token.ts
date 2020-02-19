import { TokenName } from '../../internal';
import { TOKEN_SHORTHANDS } from './TokenShorthands';

export class Token {
    readonly name: TokenName;
    readonly value: string;
    readonly start: number;

    constructor(name: TokenName, value: string, start?: number) {
        this.name = name;
        this.value = value;
        this.start = start;
    }

    get length(): number {
        return this.value != null ? this.value.length : 0;
    }

    get end(): number {
        if (this.start < 0) {
            return -1;
        }

        return this.start + this.length - 1;
    }

    toShorthand(): string {
        const sOrF = TOKEN_SHORTHANDS[this.name];
        let s = typeof sOrF === 'string' ? sOrF : sOrF(this);
        return `[${s}]`;
    }

    static binaryMinus(token: Token): Token {
        return new Token(TokenName.Subtract, token.value, token.start);
    }

    static unaryMinus(token: Token): Token {
        return new Token(TokenName.Negate, token.value, token.start);
    }
}
