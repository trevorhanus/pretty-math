import { Token } from '../../internal';

export function replaceToken(tokens: Token[], token: Token, newToken: Token) {
    const index = tokens.indexOf(token);

    if (index < 0) {
        return;
    }

    tokens.splice(index, 1, newToken);
}
