import * as React from 'react';

/**
 * This will clone a ClassComponent and a StatelessComponent and
 * just return a dom element and a string
 *
 */

export function cloneElementWithProps(el: React.ReactNode, props: any): React.ReactElement<any> {
    // just a string
    if (typeof el === 'string') {
        return el as any;
    }

    if (React.isValidElement(el)) {
        return React.cloneElement(el, props);
    }

    console.error('unknown el type: ', el);
    throw new Error('unknown element type.');
}

export function isClassComponent(el: any): el is React.ComponentClass<any> {
    return el.type != null && el.type !== 'function' && el.prototype.render != null;
}

export function isStatelessComponent(el: any): boolean {
    return el.type != null && el.type !== 'function' && el.prototype == null;
}

export function isDomElement(el: any): boolean {
    return el.type != null && typeof el.type === 'string';
}

export function join(components: React.ReactNode[], renderSeparator: (indexBefore: number) => React.ReactNode): React.ReactNode[] {
    const joined: React.ReactNode[] = [];

    components.forEach((component, i) => {
        joined.push(component);

        if (components.length - 1 === i) {
            // last component
            return;
        }

        const separator = renderSeparator(i);
        if (separator) {
            joined.push(separator);
        }
    });

    return joined;
}
