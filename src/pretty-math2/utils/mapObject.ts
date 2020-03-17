const hasOwnProperty = Object.prototype.hasOwnProperty;

export function mapObject<R>(obj: any, iterator: (key: string, value: any) => R): Record<string, R> {
    const result = {};

    for (let key in obj) {
        if (hasOwnProperty.call(obj, key)) {
            result[key] = iterator(key, obj[key]);
        }
    }

    return result;
}
