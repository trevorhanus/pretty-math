export function invariant(check: boolean, message: string): void {
    if (check) {
        throw new Error(`[math] ${message}`);
    }
}

export function fillArray<T>(len: number, el: T): T[] {
    return (new Array(len)).fill(el);
}

export const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

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

export function isString(s: any): s is string {
    return typeof s === 'string';
}

export function omitNulls<T>(obj: T): T {
    const cleaned: any = {};
    Object.keys(obj).forEach(key => {
        const val = (obj as any)[key];
        if (val != null) {
            cleaned[key] = val;
        }
    });
    return cleaned as T;
}
