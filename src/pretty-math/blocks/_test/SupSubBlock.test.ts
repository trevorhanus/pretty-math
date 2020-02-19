import { expect } from 'chai';
import { autorun } from 'mobx';
import { fillArray } from '~/core';
import { BlankBlock, Block, BlockType, calchubOutputFromChain, FractionBlock, SupSubBlock } from 'pretty-math/internal';

describe('SupSubBlock', () => {

    it('getCalchubOutput', () => {
        const ss = new SupSubBlock();

        let text = '';
        let sm = [];
        autorun(() => {
            const output = calchubOutputFromChain(ss);
            text = output.text;
            sm = output.sourceMap;
        });

        expect(text).to.eq('');
        expect(sm).to.deep.eq([]);

        const bb = new BlankBlock();
        ss.setSup(bb);

        expect(text).to.eq('^{}');
        expect(sm).to.deep.eq([ss, ss, ss]);

        const bb2 = new BlankBlock();
        ss.setSub(bb2);

        expect(text).to.eq('_x007b007d ^{}');
        expect(sm).to.deep.eq(fillArray(14, ss));

        const b = new Block('a');
        ss.setSub(b);

        expect(text).to.eq('_x007b0061007d ^{}');
        expect(sm).to.deep.eq([
            ...fillArray(6, ss),
            ...fillArray(4, b),
            ...fillArray(8, ss),
        ]);
    });

    it('getCalchubOutput: sub only', () => {
        const ss = new SupSubBlock();
        const a = new Block('a');
        ss.setSub(a);
        // _x007b0061007d
        const { text, sourceMap } = calchubOutputFromChain(ss);
        expect(text).to.eq('_x007b0061007d');
        expect(sourceMap).to.deep.eq([
            ...fillArray(6, ss),
            ...fillArray(4, a),
            ...fillArray(4, ss),
        ]);
    });

    it('getCalchubOutput: with long sub and sup', () => {
        const ss = new SupSubBlock();
        const a = new Block('a');
        const b = new Block('b');
        const c = new Block('c');
        const d = new Block('d');
        a.insertChainRight(b);
        ss.setSub(a);
        c.insertChainRight(d);
        ss.setSup(c);

        // _x007b00610062007d ^{cd}
        const { text, sourceMap } = calchubOutputFromChain(ss);
        expect(text).to.eq('_x007b00610062007d ^{cd}');
        expect(sourceMap).to.deep.eq([
            ...fillArray(6, ss),
            ...fillArray(4, a),
            ...fillArray(4, b),
            ...fillArray(7, ss),
            ...[c, d, ss],
        ]);
    });

    it('getCalchubOutput: with sup', () => {
        const ss = new SupSubBlock();
        const a = new Block('a');
        ss.setSup(a);
        // ^{a}

        const { text, sourceMap } = calchubOutputFromChain(ss);
        expect(text).to.eq('^{a}');
        expect(sourceMap).to.deep.eq([ss, ss, a, ss]);
    });

    it('getCalchubOutput: nested subscripts', () => {
        const x = new Block('x');
        const ss = new SupSubBlock();
        const i = new Block('i');
        const ss2 = new SupSubBlock();
        const j = new Block('j');
        x.insertChainRight(ss);
        ss.setSub(i);
        i.insertChainRight(ss2);
        ss2.setSub(j);

        const { text, sourceMap } = calchubOutputFromChain(x);
        expect(text).to.eq('x_x007b0069005f0078003000300037006200300030003600610030003000370064007d');
    });

    it('set sup and sub', () => {
        const ss = new SupSubBlock();
        const a = new Block('a');
        const b = new Block('b');
        ss.setSup(a);
        ss.setSub(b);

        expect(calchubOutputFromChain(ss).text).to.eq('_x007b0062007d ^{a}');
        expect(ss.sup).to.eq(a);
        expect(ss.sub).to.eq(b);
        expect(a.parent).to.eq(ss);
        expect(b.parent).to.eq(ss);
    });

    it('toJS()', () => {
        const ss = new SupSubBlock();
        expect(ss.toJS()).to.deep.eq([
            {
                id: ss.id,
                type: BlockType.SupSub
            },
        ]);

        const b1 = new BlankBlock();
        const b2 = new BlankBlock();
        ss.setSup(b1);
        ss.setSub(b2);

        expect(ss.toJS()).to.deep.eq([
            {
                id: ss.id,
                type: BlockType.SupSub,
                sup: [
                    {
                        id: b1.id,
                        type: BlockType.Blank
                    },
                ],
                sub: [
                    {
                        id: b2.id,
                        type: BlockType.Blank
                    },
                ]
            },
        ]);

        const frac = new FractionBlock();
        ss.setSup(frac);

        expect(ss.toJS()).to.deep.eq([
            {
                id: ss.id,
                type: BlockType.SupSub,
                sup: [
                    {
                        id: frac.id,
                        type: BlockType.Fraction,
                        num: [
                            {
                                id: frac.num.id,
                                type: BlockType.Blank
                            },
                        ],
                        denom: [
                            {
                                id: frac.denom.id,
                                type: BlockType.Blank
                            },
                        ],
                    },
                ],
                sub: [
                    {
                        id: b2.id,
                        type: BlockType.Blank
                    },
                ]
            },
        ]);
    });
});
