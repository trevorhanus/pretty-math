export const UC = {
    ReverseSolidus: '\u005c',
    ColonEquals:    '\u2254',
    DotOperator:    '\u22c5',
    MinusSign:      '\u2212',
    Infinity:       '\u221e',

    ImplicitM:      '\u229B', // used for implicit multiplication

    ZeroWidthSpace: '\u200b',

    // Greek Capitals
    Alpha:          '\u0391',
    Beta:           '\u0392',
    Gamma:          '\u0393',
    Delta:          '\u0394',
    Omega:          '\u03A9',

    // Greek Lowercase
    alpha:          '\u03B1',
    beta:           '\u03B2',
    omega:          '\u03C9',

    Blocks: {
        Greek: {
            Start: '\u0370'.charCodeAt(0),
            End: '\u03FF'.charCodeAt(0),
        },
        AccentedLatin: {
            Start: '\u00C0'.charCodeAt(0),
            End: '\u02AF'.charCodeAt(0),
        }
    }
};
