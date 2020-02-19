import { fillArray } from '../internal';

export interface Output<T> {
    expr: string;
    sourceMap: T[];
}

export class OutputTemplate<T> {
    private _template: string;
    private _source: T;

    constructor(template: string, source: T) {
        this._template = template;
        this._source = source;
    }

    buildOutput(subs: Output<T>[]): Output<T> {
        let expr = this._template;
        let sourceMap = fillArray(expr.length, this._source);

        for (let i = subs.length -1; i >= 0; --i) {
            const placeholder = '$' + i;
            const deleteCount = placeholder.length;
            const sub = subs[i];

            findSpliceLocations(placeholder, expr).forEach(loc => {
                expr = spliceString(expr, loc, deleteCount, sub.expr);
                sourceMap.splice(loc, deleteCount, ...sub.sourceMap);
            });
        }

        return {
            expr,
            sourceMap,
        }
    }

    static compile<T>(template: string, source: T): OutputTemplate<T> {
        return new OutputTemplate(template, source);
    }
}

export function joinOutputs<T>(...outputs: Output<T>[]): Output<T> {
    if (outputs == null || outputs.length === 0) {
        return { expr: '', sourceMap: [] };
    }

    const output = {
        expr: '',
        sourceMap: [],
    };

    outputs.forEach(o => {
        output.expr = output.expr + o.expr;
        output.sourceMap = output.sourceMap.concat(o.sourceMap);
    });

    return output;
}

export function outputFromString<T>(str: string, source: T): Output<T> {
    if (str == null) {
        return {
            expr: '',
            sourceMap: [],
        };
    }

    return {
        expr: str,
        sourceMap: fillArray(str.length, source),
    }
}

function findSpliceLocations(subStr: string, template: string): number[] {
    const locs = [];
    let i = -1;

    while((i = template.indexOf(subStr, i + 1)) >= 0) {
        locs.push(i);
    }

    return locs;
}

function spliceString(str: string, start: number, deleteCount: number, add: string): string {
    if (start < 0) {
        start = str.length + start;
    }

    if (start < 0) {
        start = 0;
    }

    return str.slice(0, start) + add + str.slice(start + deleteCount);
}
