import { INode, TokenName } from 'math';
import { IBlock, ChainBuilder } from 'pretty-math/internal';

const {
    biop,
    derivative,
    dfunc,
    diff,
    frac,
    func,
    integral,
    libraryEntry,
    matrix,
    parens,
    partialDiff,
    sqrt,
    sup,
    symbol,
    tokenValue,
    udf,
    unary
} = ChainBuilder;

export type BuilderFn = (node: INode, children?: IBlock[]) => IBlock;
const _ = TokenName;

export const TOKEN_TO_BUILDER: { [name in TokenName]: BuilderFn } = {

    [_.Missing]: null,
    [_.Space]: null, // shouldn't ever show up in tree

    [_.e]: tokenValue,
    [_.pi]: libraryEntry('\\pi'),
    [_.Infinity]: libraryEntry('\\inf'),

    // unary operators
    [_.Factorial]: unary,
    [_.Negate]: unary,

    // binary operators
    [_.Add]: biop('+'),
    [_.Assign]: biop('='),
    [_.Comma]: biop(', '),
    [_.Divide]: biop('/'),
    [_.ImplMultiply]: biop(''),
    [_.Multiply]: biop('*'),
    [_.Power]: sup,
    [_.Subtract]: biop('-'),

    // trig functions
    [_.Acos]: func('acos', '\\arccos'),
    [_.Asin]: func('asin', '\\arcsin'),
    [_.Atan]: func('atan', '\\arctan'),
    [_.Acosh]: func('acosh', '\\chacosh'),
    [_.Asinh]: func('asinh', '\\chasinh'),
    [_.Atanh]: func('atanh', '\\chatanh'),
    [_.Cos]: func('cos', '\\cos'),
    [_.Cosh]: func('cosh', '\\cosh'),
    [_.Sin]: func('sin', '\\sin'),
    [_.Sinh]: func('sinh', '\\sinh'),
    [_.Tan]: func('tan', '\\tan'),
    [_.Tanh]: func('tanh', '\\tanh'),

    // arithmetic functions
    [_.Abs]: func('abs'),
    [_.Exp]: func('exp'),
    [_.Frac]: frac,
    [_.Ln]: func('ln', '\\ln'),
    [_.Log]: func('log', '\\log'),
    [_.Max]: func('max', '\\chmax'),
    [_.Min]: func('min', '\\chmin'),
    [_.Sqrt]: sqrt,
    [_.Sum]: func('sum', '\\chsum'),

    // calchub
    [_.Dfunc]: dfunc,
    [_.UserDefinedFunc]: udf,

    // linear algebra
    [_.Matrix]: matrix,
    [_.CrossP]: biop('\\crossp'),
    [_.DotP]: biop('\\dotp'),
    [_.Transpose]: null,

    // calculus
    [_.Derivative]: derivative,
    [_.Integral]: integral,
    [_.Pwrt]: partialDiff,
    [_.Wrt]: diff,

    // array
    [_.Array]: null,
    [_.ArrayOpener]: null,
    [_.ArrayCloser]: null,

    // parens
    [_.EscapedLeftCurlyParens]: parens,
    [_.LeftCurlyParens]: parens,
    [_.LeftRoundParens]: parens,
    [_.EscapedRightCurlyParens]: null, // right parens are taken care of by left
    [_.RightCurlyParens]: null,
    [_.RightRoundParens]: null,

    // operands
    [_.Literal]: tokenValue,
    [_.Symbol]: symbol,

    // greeks
    [_.alpha]: libraryEntry('\\alpha'),
    [_.beta]: libraryEntry('\\beta'),
    [_.gamma]: libraryEntry('\\gamma'),
    [_.delta]: libraryEntry('\\delta'),
    [_.epsilon]: libraryEntry('\\epsilon'),
    [_.zeta]: libraryEntry('\\zeta'),
    [_.eta]: libraryEntry('\\eta'),
    [_.theta]: libraryEntry('\\theta'),
    [_.kappa]: libraryEntry('\\kappa'),
    [_.lambda]: libraryEntry('\\lambda'),
    [_.mu]: libraryEntry('\\mu'),
    [_.nu]: libraryEntry('\\nu'),
    [_.xi]: libraryEntry('\\xi'),
    [_.rho]: libraryEntry('\\rho'),
    [_.sigma]: libraryEntry('\\sigma'),
    [_.tau]: libraryEntry('\\tau'),
    [_.upsilon]: libraryEntry('\\upsilon'),
    [_.phi]: libraryEntry('\\phi'),
    [_.chi]: libraryEntry('\\chi'),
    [_.psi]: libraryEntry('\\psi'),
    [_.omega]: libraryEntry('\\omega'),

    [_.Gamma]: libraryEntry('\\Gamma'),
    [_.Delta]: libraryEntry('\\Delta'),
    [_.Theta]: libraryEntry('\\Theta'),
    [_.Lambda]: libraryEntry('\\Lambda'),
    [_.Xi]: libraryEntry('\\Xi'),
    [_.Pi]: libraryEntry('\\Pi'),
    [_.Sigma]: libraryEntry('\\Sigma'),
    [_.Upsilon]: libraryEntry('\\Upsilon'),
    [_.Phi]: libraryEntry('\\Phi'),
    [_.Psi]: libraryEntry('\\Psi'),
    [_.Omega]: libraryEntry('\\Omega'),

};
