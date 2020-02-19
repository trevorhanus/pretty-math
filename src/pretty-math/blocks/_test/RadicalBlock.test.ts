import { expect } from 'chai';
import { autorun } from 'mobx';
import { fillArray } from '~/core';
import { Block, calchubOutputFromChain, RadicalBlock } from 'pretty-math/internal';

describe('RadicalBlock', () => {

    it('getCalchubOutput', () => {
        const r = new RadicalBlock();

        let text = '';
        let sm = [];
        autorun(() => {
            const output = calchubOutputFromChain(r);
            text = output.text;
            sm = output.sourceMap;
        });

        expect(text).to.eq('\\sqrt{}');
        expect(sm).to.deep.eq(fillArray(7, r));

        const a = new Block('a');
        r.setInner(a);

        expect(text).to.eq('\\sqrt{a}');
        expect(sm).to.deep.eq([
            ...fillArray(6, r),
            ...[a],
            ...[r],
        ]);
    });
});
