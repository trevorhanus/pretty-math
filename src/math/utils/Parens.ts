export const ANY_PARENS = /^[\(\)\[\]\{\}]|(\\\{)|(\\\})$/;
export const ANY_LEFT_PARENS = /^[\(\[\{]|(\\\{)$/;
export const ANY_RIGHT_PARENS = /^[\)\]\}]|(\\\})$/;

export function isAnyParens(char: string): boolean {
    return ANY_PARENS.test(char);
}

export function isAnyLeftParens(char: string): boolean {
    return ANY_LEFT_PARENS.test(char);
}

export function isAnyRightParens(char: string): boolean {
    return ANY_RIGHT_PARENS.test(char);
}

export function isLeftCurlyParens(char: string): boolean {
    return char === '{';
}

export function isRightCurlyParens(char: string): boolean {
    return char === '}';
}

const pairs = {
    '(': ')',
    ')': '(',
    '[': ']',
    ']': '[',
    '{': '}',
    '}': '{',
    '\\{': '\\}',
    '\\}': '\\{',
};

export function getParensPair(parens: string): string {
    return pairs[parens];
}
