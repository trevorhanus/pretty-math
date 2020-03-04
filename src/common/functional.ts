const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Executes the provided `callback` once for each enumerable own property in the
 * object and constructs a new object from the results. The `callback` is
 * invoked with three arguments:
 *
 *  - the property value
 *  - the property name
 *  - the object being traversed
 *
 * Properties that are added after the call to `mapObject` will not be visited
 * by `callback`. If the values of existing properties are changed, the value
 * passed to `callback` will be the value at the time `mapObject` visits them.
 * Properties that are deleted before being visited are not visited.
 *
 * @grep function objectMap()
 * @grep function objMap()
 *
 * @param {?object} object
 * @param {function} callback
 * @param {*} context
 * @return {?object}
 */
export function mapObject(object: any, callback: (value: any, key: string, obj: any) => any, context?: any): any {
    if (!object) {
        return null;
    }
    const result = {};
    for (let name in object) {
        if (hasOwnProperty.call(object, name)) {
            result[name] = callback.call(context, object[name], name, object);
        }
    }
    return result;
}
