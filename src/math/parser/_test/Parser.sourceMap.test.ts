import { expect } from 'chai';
import { parseCalchub, Parser, TokenName } from '../../internal';

const {
    Add,
    Assign: Ass,
    Comma,
    Cos,
    Divide,
    Derivative: Der,
    Dfunc,
    LeftCurlyParens: Lcp,
    LeftRoundParens: Lp,
    Literal: Lit,
    Multiply,
    Pi,
    Power: Pow,
    RightCurlyParens: Rcp,
    RightRoundParens: Rp,
    Space,
    Sin,
    Subtract: Sub,
    Symbol: Sym,
    UserDefinedFunc: Udf,
} = TokenName;

describe('Parser.sourceMap', () => {

    it('works', () => {
        [
            {
                expr: 'x+2*4',
                expected: [
                    [0, Sym],
                    [1, Add],
                    [2, Lit],
                    [3, Multiply],
                    [4, Lit],
                ]
            },
            {
                expr: '\\dfunc{f,x}=x^{2}',
                expected: [
                    [0, Dfunc],
                    [7, Sym], // f
                    [8, Comma],
                    [9, Sym], // x
                    [11, Ass],
                    [12, Sym],
                    [13, Pow],
                    [15, Lit],
                ]
            }
        ].forEach(test => {
            const { expr, expected } = test;
            const { sourceMap } = parseCalchub(expr);
            // console.log(Object.keys(sourceMap).map(i => `key: ${i}, ${sourceMap[i].tokenValue}`));
            expected.forEach(orientation => {
                const [ index, tokenName ] = orientation;
                expect(sourceMap[index].tokenName, `${expr}: index ${index} should be ${tokenName} but is ${sourceMap[index].tokenName}`).to.eq(tokenName);
            });
        });
    });

});
