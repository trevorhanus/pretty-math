export class SyntaxError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export interface MathError {
    code: ErrorCode;
    message: string;
    start?: number;
    length?: number;
}

export enum ErrorCode {

    /**
     * CircularReference: This happens when an expression references
     * itself
     *
     */
    CircularReference = 'circular_reference',

    /**
     * Duplicate: This happens when there are two or more
     * expressions that define a function or variable with the same name
     *
     */
    Duplicate = 'duplicate',

    /**
     * happens when there was a character in the
     * input string that is not part of any of the valid
     * char ranges
     *
     * eg: 😄
     */
    InvalidChar = 'invalid_char',

    /**
     * MissingChar: happens when we were expecting a
     * certain kind of character and it's missing
     *
     */
    MissingChar = 'missing_char',

    ReferenceNotFound = 'reference_not_found',

    /**
     * ReservedWord: happens when we find a word
     * that is on the reserved word list
     *
     */
    ReservedWord = 'ReservedWord',

    /**
     * Syntax: a generic error code when it's unclear
     * what actually happened
     *
     */
    Syntax = 'Syntax',

    /**
     * UnbalancedParens: opening a parens and not closing it
     *
     */
    UnbalancedParens = 'UnbalancedParens',

    /**
     * UnexpectedChar: when there is a char in the wrong place
     *
     */
    UnexpectedChar = 'UnexpectedChar',
}
