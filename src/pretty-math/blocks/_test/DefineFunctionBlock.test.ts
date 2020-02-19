import { expect } from 'chai';
import { autorun } from 'mobx';
import { Block, buildChainFromCalchub, calchubOutputFromChain, DefineFunctionBlock } from 'pretty-math/internal';
import { fillArray } from '~/core';

describe('UserDefinedFunctionBlock', () => {

    it('toJS', () => {
        const uf = new DefineFunctionBlock();
        const x = new Block('x');
        const y = new Block('y');
        uf.setFuncName(x);
        uf.setInner(y);
        expect(uf.toJS()[0]).to.deep.eq({
            id: uf.id,
            type: 'u-function',
            latex: '\\dfunc',
            funcName: [
                {
                    id: x.id,
                    type: 'block',
                    text: 'x',
                }
            ],
            inner: [
                {
                    id: y.id,
                    type: 'block',
                    text: 'y',
                }
            ]
        });
    });

    it('getCalchubOutput', () => {
        const udf = new DefineFunctionBlock();

        let text = '';
        let sm = [];
        autorun(() => {
            const output = calchubOutputFromChain(udf);
            text = output.text;
            sm = output.sourceMap;
        });

        expect(text).to.eq('\\dfunc{,}');
        expect(sm).to.deep.eq(fillArray(9, udf));

        const f = new Block('f');
        udf.setFuncName(f);

        expect(text).to.eq('\\dfunc{f,}');
        expect(sm).to.deep.eq([
            ...fillArray(7, udf),
            ...[f],
            ...fillArray(2, udf),
        ]);

        const x = new Block('x');
        udf.setInner(x);

        expect(text).to.eq('\\dfunc{f,x}');
        expect(sm).to.deep.eq([
            ...fillArray(7, udf),
            ...[f, udf, x, udf],
        ]);

        const eq = new Block('=');
        udf.insertChainRight(eq);

        expect(text).to.eq('\\dfunc{f,x}=');
        expect(sm).to.deep.eq([
            ...fillArray(7, udf),
            ...[f, udf, x, udf, eq],
        ]);

        const s = new Block('s');
        const i = new Block('i');

        eq.insertChainRight(s);
        s.insertChainRight(i);

        expect(text).to.eq('\\dfunc{f,x}=si');
        expect(sm).to.deep.eq([
            ...fillArray(7, udf),
            ...[f, udf, x, udf, eq, s, i],
        ]);
    });

    it('getCalchubOutput', () => {
        const chain = buildChainFromCalchub('\\dfunc{f,x}=si');
        const { text, sourceMap } = calchubOutputFromChain(chain);
        expect(text).to.eq('\\dfunc{f,x}=si');
        // \dfunc{f,x}=si
        // 01234567890123456
        expect(sourceMap.length).to.eq(14);
    });

    xit('position', () => {
        const dfunc = buildChainFromCalchub('\\dfunc{f,x}=si') as DefineFunctionBlock;
        const f = dfunc.funcName;
        const x = dfunc.inner;
    });

});
