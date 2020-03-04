export function between(min: number, max: number, num: number): number {
    return Math.max(min, Math.min(max, num));
}

export function fillArray<T>(len: number, el: T): T[] {
    return (new Array(len)).fill(el);
}

/**
 * generateId(): string
 *
 * Generates a locally unique id. stores a map of seen ids to ensure they are unique.
 * These are not guaranteed to be unique globally
 *
 */

const seenIds: { [id: string]: boolean } = {};
const MULTIPLIER = Math.pow(2, 24);

export function generateId(): string {
    let id = null;
    while (id == null || seenIds.hasOwnProperty(id) || !isNaN(+id)) { // !isNaN() just making sure it's not a number
        id = Math.floor(Math.random() * MULTIPLIER).toString(32);
    }
    seenIds[id] = true;
    return id;
}

export function isOr<T>(isVal: T | null, orVal: T | (() => T)): T {
    if (isVal != null) {
        return isVal;
    } else {
        return typeof orVal === 'function' ? (orVal as () => T)() : orVal;
    }
}

export function isPlainObject(value) {
    if (value === null || typeof value !== "object") return false;
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null
}

export function isEmpty(sub: any): boolean {
    if (sub == null) {
        return true;
    }

    if (typeof sub === 'string' && sub === '') {
        return true;
    }

    if (Array.isArray(sub) && sub.length === 0) {
        return true;
    }

    if (isPlainObject(sub) && Object.keys(sub).length === 0) {
        return true;
    }

    return false;
}

/**
 * Memoizes the return value of a function that accepts one string argument.
 */
export function memoizeStringOnly<T>(callback: (s: string) => T): (s: string) => T {
    const cache = {};
    return function(string) {
        if (!cache.hasOwnProperty(string)) {
            cache[string] = callback.call(this, string);
        }
        return cache[string];
    };
}

export function omitNulls<T>(obj: any): T {
    const cleaned: any = {};
    Object.keys(obj).forEach(key => {
        const val = obj[key];
        if (val != null) {
            cleaned[key] = val;
        }
    });
    return cleaned as T;
}
