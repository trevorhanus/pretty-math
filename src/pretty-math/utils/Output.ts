import { toHex, fillArray } from 'common';
import { IBlock } from 'pretty-math/internal';

export type Source = any;

export interface OutputSegment {
    text: string;
    source: Source;
}

export class Output {
    segments: (OutputSegment | Output)[];

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

            if (seg instanceof Output) {
                _map = seg.sourceMap;
            } else {
                _map = fillArray(seg.text.length, seg.source);
            }

            map.push(..._map);
            return map;
        }, []);
    }

    between(seg: OutputSegment | Output): Output {
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

    append(...segs: (OutputSegment | Output)[]): Output {
        return Output.fromMany([
            ...this.segments,
            ...omitEmpty(segs)
        ]);
    }

    prepend(...segs: (OutputSegment | Output)[]): Output {
        return Output.fromMany([
            ...omitEmpty(segs),
            ...this.segments,
        ]);
    }

    static blank(): Output {
        return new Output();
    }

    static expandToHex(output: Output): Output {
        const { text, sourceMap } = output;
        let o = new Output();

        for (let i = 0; i < output.text.length; i++) {
            const char = text[i];
            const source = sourceMap[i];
            o = o.append({ text: toHex(char), source });
        }

        return o;
    }

    static fromOne(segment: OutputSegment | Output): Output {
        const o = new Output();
        o.segments.push(segment);
        return o;
    }

    static fromMany(segments: (OutputSegment | Output)[]): Output {
        const o = new Output();
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

export type BlockSourceMap = IBlock[];

export function getStartIndexForBlock(block: IBlock, blockSourceMap: BlockSourceMap): number {
    let i = 0;

    while (i < blockSourceMap.length) {
        if (blockSourceMap[i] === block) {
            return i;
        }
        i++;
    }

    return -1;
}
