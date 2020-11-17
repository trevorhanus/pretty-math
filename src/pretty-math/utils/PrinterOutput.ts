import { toHex, fillArray } from 'common';

export type Source = any;

export interface OutputSegment {
    text: string;
    source: Source;
}

export class PrinterOutput {
    segments: (OutputSegment | PrinterOutput)[];

    constructor() {
        this.segments = [];
    }

    get text(): string {
        return this.segments.reduce((text, seg) => {
            text += seg.text;
            return text;
        }, '');
    }

    get sourceMap(): Source[] {
        return this.segments.reduce((map, seg) => {
            let _map = [];

            if (seg instanceof PrinterOutput) {
                _map = seg.sourceMap;
            } else {
                _map = fillArray(seg.text.length, seg.source);
            }

            map.push(..._map);
            return map;
        }, []);
    }

    between(seg: OutputSegment | PrinterOutput): PrinterOutput {
        if (this.segments.length <= 1) {
            return this;
        }

        let i = 1;

        while (i < this.segments.length) {
            this.segments.splice(i, 0, seg);
            i += 2;
        }

        return this;
    }

    append(...segs: (OutputSegment | PrinterOutput)[]): PrinterOutput {
        return PrinterOutput.fromMany([
            ...this.segments,
            ...omitEmpty(segs)
        ]);
    }

    prepend(...segs: (OutputSegment | PrinterOutput)[]): PrinterOutput {
        return PrinterOutput.fromMany([
            ...omitEmpty(segs),
            ...this.segments,
        ]);
    }

    static blank(): PrinterOutput {
        return new PrinterOutput();
    }

    static expandToHex(output: PrinterOutput): PrinterOutput {
        const { text, sourceMap } = output;
        let o = new PrinterOutput();

        for (let i = 0; i < output.text.length; i++) {
            const char = text[i];
            const source = sourceMap[i];
            o = o.append({ text: toHex(char), source });
        }

        return o;
    }

    static fromOne(segment: OutputSegment | PrinterOutput): PrinterOutput {
        const o = new PrinterOutput();
        o.segments.push(segment);
        return o;
    }

    static fromMany(segments: (OutputSegment | PrinterOutput)[]): PrinterOutput {
        const o = new PrinterOutput();
        segments.forEach(seg => {
            if (seg == null) {
                return;
            }

            o.segments.push(seg);
        });
        return o;
    }
}

function omitEmpty<T>(arr: T[]): T[] {
    if (!arr) {
        return [];
    }

    return arr.reduce((r, item) => {
        if (item != null) {
            r.push(item);
        }
        return r;
    }, []);
}

export function getStartIndexForSource(source: any, sourceMap: Source[]): number {
    return sourceMap.findIndex(v => source === v);
}
