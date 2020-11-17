const hasOwnProperty = Object.prototype.hasOwnProperty;

export function someObject(obj: any, iterator: (value: any, key: string) => boolean): boolean {
    for (let key in obj) {
        if (hasOwnProperty.call(obj, key)) {
            const result = iterator(obj[key], key);
            if (result === true) {
                return true;
            }
        }
    }

    return false;
}
