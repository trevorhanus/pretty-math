/**
 * Copied code from https://github.com/essdot/spliddit
 */

const HIGH_SURROGATE_START = 0xD800;
const HIGH_SURROGATE_END = 0xDBFF;

const LOW_SURROGATE_START = 0xDC00;

const REGIONAL_INDICATOR_START = 0x1F1E6;
const REGIONAL_INDICATOR_END = 0x1F1FF;

const FITZPATRICK_MODIFIER_START = 0x1f3fb;
const FITZPATRICK_MODIFIER_END = 0x1f3ff;

export function splitUnicodeString(s: string): string[] {
    if (s == null) {
        return [];
    }

    let i = 0;
    const result = [];

    while (i < s.length) {
        const increment = takeHowMany(i, s);
        result.push(s.substring(i, i + increment));
        i += increment;
    }

    return result;
}

// Decide how many code units make up the current character.
// BMP characters: 1 code unit
// Non-BMP characters (represented by surrogate pairs): 2 code units
// Emoji with skin-tone modifiers: 4 code units (2 code points)
// Country flags: 4 code units (2 code points)
function takeHowMany(i: number, s: string): number {
    const lastIndex = s.length - 1;
    const current = s[i];
    let currentPair;
    let nextPair;

    // If we don't have a value that is part of a surrogate pair, or we're at
    // the end, only take the value at i
    if (!isFirstOfSurrogatePair(current) || i === lastIndex) {
        return 1;
    }

    // If the array isn't long enough to take another pair after this one, we
    // can only take the current pair
    if ((i + 3) > lastIndex) {
        return 2;
    }

    currentPair = current + s[i + 1];
    nextPair = s.substring(i + 2, i + 5);

    // Country flags are comprised of two regional indicator symbols,
    // each represented by a surrogate pair.
    // See http://emojipedia.org/flags/
    // If both pairs are regional indicator symbols, take 4
    if (isRegionalIndicatorSymbol(currentPair) &&
        isRegionalIndicatorSymbol(nextPair)) {
        return 4;
    }

    // If the next pair make a Fitzpatrick skin tone
    // modifier, take 4
    // See http://emojipedia.org/modifiers/
    // Technically, only some code points are meant to be
    // combined with the skin tone modifiers. This function
    // does not check the current pair to see if it is
    // one of them.
    if (isFitzpatrickModifier(nextPair)) {
        return 4;
    }

    return 2;
}

// Turn two code units (surrogate pair) into
// the code point they represent.
function codePointFromSurrogatePair(s): number {
    const highOffset = s.charCodeAt(0) - HIGH_SURROGATE_START;
    const lowOffset = s.charCodeAt(1) - LOW_SURROGATE_START;

    return (highOffset << 10) + lowOffset + 0x10000;
}

function isFirstOfSurrogatePair (c) {
    if (c === void 0 || c === null || !c.hasOwnProperty(0)) {
        return false;
    }

    return betweenInclusive(
        c[0].charCodeAt(0),
        HIGH_SURROGATE_START,
        HIGH_SURROGATE_END
    );
}

function isFitzpatrickModifier (s) {
    var codePoint = codePointFromSurrogatePair(s);

    return betweenInclusive(
        codePoint,
        FITZPATRICK_MODIFIER_START,
        FITZPATRICK_MODIFIER_END
    );
}

function isRegionalIndicatorSymbol(s): boolean {
    var codePoint = codePointFromSurrogatePair(s);

    return betweenInclusive(
        codePoint,
        REGIONAL_INDICATOR_START,
        REGIONAL_INDICATOR_END
    );
}

function betweenInclusive(value: number, lowerBound: number, upperBound: number): boolean {
    return value >= lowerBound && value <= upperBound;
}
