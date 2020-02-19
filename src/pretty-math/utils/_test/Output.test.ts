import { expect } from 'chai';
import { fillArray } from '~/core';
import { Output } from 'pretty-math/utils/Output';

describe('Output', () => {

    it('fromOne', () => {
        const s1 = {};
        const output = Output.fromOne({ text: 'foo', source: s1 });
        expect(output.text).to.eq('foo');
        expect(output.sourceMap).to.deep.eq(fillArray(3, s1));
    });

    it('fromMany', () => {
        const s1 = {};
        const s2 = {};
        const output = Output.fromMany([
            { text: 'foo', source: s1 },
            { text: 'bar', source: s2 },
        ]);

        expect(output.text).to.eq('foobar');
        expect(output.sourceMap).to.deep.eq([
            ...fillArray(3, s1),
            ...fillArray(3, s2)
        ]);
    });

    it('fromMany: one is Output', () => {
        const s1 = {};
        const s2 = {};

        const o1 = Output.fromOne({ text: 'foo', source: s1 });

        const output = Output.fromMany([
            o1,
            { text: 'bar', source: s2 },
        ]);

        expect(output.text).to.eq('foobar');
        expect(output.sourceMap).to.deep.eq([
            ...fillArray(3, s1),
            ...fillArray(3, s2)
        ]);
    });

    it('append with empty values', () => {
        const s1 = {};
        const s2 = {};

        const o1 = Output.fromOne({ text: 'foo', source: s1 });

        let output = Output.fromMany([
            o1,
            { text: 'bar', source: s2 },
        ]);

        output = output.append(null);
        output = output.append();
        output = output.append(undefined);

        expect(output.segments.length).to.eq(2);
        expect(output.text).to.eq('foobar');
        expect(output.sourceMap).to.deep.eq([
            ...fillArray(3, s1),
            ...fillArray(3, s2)
        ]);
    });

    it('between', () => {
        const s1 = {};
        const s2 = {};
        const s3 = {};

        const output = Output.fromMany([
            { text: 'foo', source: s1 },
            { text: 'bar', source: s2 },
        ]);

        output.between({ text: ',', source: s3 });

        expect(output.text).to.eq('foo,bar');
        expect(output.sourceMap).to.deep.eq([
            ...fillArray(3, s1),
            ...fillArray(1, s3),
            ...fillArray(3, s2)
        ]);
    });
});
