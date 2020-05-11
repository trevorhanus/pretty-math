import { TokenName, INode } from 'math';
import {
    Block,
    atomic,
    biop,
    derivative,
    diff,
    frac,
    func,
    integral,
    parens,
    partialDiff,
    skip,
    sqrt,
    sup,
    symbol,
    unary
} from 'pretty-math2/internal';

export type TokenBuilderFn = (node: INode, children?: Block[][]) => Block[];
const _ = TokenName;

export const TOKEN_TO_BUILDER: { [name in TokenName]: TokenBuilderFn } = {

    [_.Missing]: null,
    [_.Space]: null, // shouldn't ever show up in tree

    [_.e]: atomic,
    [_.pi]: null, //libraryEntry('\\pi'),
    [_.Infinity]: null, //libraryEntry('\\inf'),

    // unary operators
    [_.Factorial]: unary,
    [_.Negate]: unary,

    // binary operators
    [_.Add]: biop('+'),
    [_.Assign]: biop('='),
    [_.Comma]: biop(', '),
    [_.Divide]: biop('/'),
    [_.ImplMultiply]: biop(),
    [_.Multiply]: biop('*'),
    [_.Power]: sup,
    [_.Subtract]: biop('-'),

    // trig functions
    [_.Acos]: func('acos'),
    [_.Asin]: func('asin'),
    [_.Atan]: func('atan'),
    [_.Acosh]: func('acosh'),
    [_.Asinh]: func('asinh'),
    [_.Atanh]: func('atanh'),
    [_.Cos]: func('cos'),
    [_.Cosh]: func('cosh'),
    [_.Sin]: func('sin'),
    [_.Sinh]: func('sinh'),
    [_.Tan]: func('tan'),
    [_.Tanh]: func('tanh'),

    // arithmetic functions
    [_.Abs]: func('abs'),
    [_.Exp]: func('exp'),
    [_.Frac]: frac,
    [_.Ln]: func('ln'),
    [_.Log]: func('log'),
    [_.Max]: func('max'),
    [_.Min]: func('min'),
    [_.Sqrt]: sqrt,
    [_.Sum]: func('sum'),

    // calchub
    [_.Dfunc]: null, // TODO: dfunc,
    [_.UserDefinedFunc]: null, // TODO: udf,

    // linear algebra
    [_.Matrix]: null, // TODO: matrix,
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
    [_.EscapedLeftCurlyParens]: parens('\\{', '\\}'),
    [_.LeftCurlyParens]: parens('{', '}'),
    [_.LeftRoundParens]: parens(),
    [_.EscapedRightCurlyParens]: null, // right parens are taken care of by left
    [_.RightCurlyParens]: null,
    [_.RightRoundParens]: null,

    // operands
    [_.Literal]: atomic,
    [_.Symbol]: symbol,

    // greeks
    [_.alpha]: null, //libraryEntry('\\alpha'),
    [_.beta]: null, //libraryEntry('\\beta'),
    [_.gamma]: null, //libraryEntry('\\gamma'),
    [_.delta]: null, //libraryEntry('\\delta'),
    [_.epsilon]: null, //libraryEntry('\\epsilon'),
    [_.zeta]: null, //libraryEntry('\\zeta'),
    [_.eta]: null, //libraryEntry('\\eta'),
    [_.theta]: null, //libraryEntry('\\theta'),
    [_.kappa]: null, //libraryEntry('\\kappa'),
    [_.lambda]: null, //libraryEntry('\\lambda'),
    [_.mu]: null, //libraryEntry('\\mu'),
    [_.nu]: null, //libraryEntry('\\nu'),
    [_.xi]: null, //libraryEntry('\\xi'),
    [_.rho]: null, //libraryEntry('\\rho'),
    [_.sigma]: null, //libraryEntry('\\sigma'),
    [_.tau]: null, //libraryEntry('\\tau'),
    [_.upsilon]: null, //libraryEntry('\\upsilon'),
    [_.phi]: null, //libraryEntry('\\phi'),
    [_.chi]: null, //libraryEntry('\\chi'),
    [_.psi]: null, //libraryEntry('\\psi'),
    [_.omega]: null, //libraryEntry('\\omega'),

    [_.Gamma]: null, //libraryEntry('\\Gamma'),
    [_.Delta]: null, //libraryEntry('\\Delta'),
    [_.Theta]: null, //libraryEntry('\\Theta'),
    [_.Lambda]: null, //libraryEntry('\\Lambda'),
    [_.Xi]: null, //libraryEntry('\\Xi'),
    [_.Pi]: null, //libraryEntry('\\Pi'),
    [_.Sigma]: null, //libraryEntry('\\Sigma'),
    [_.Upsilon]: null, //libraryEntry('\\Upsilon'),
    [_.Phi]: null, //libraryEntry('\\Phi'),
    [_.Psi]: null, //libraryEntry('\\Psi'),
    [_.Omega]: null, //libraryEntry('\\Omega'),

};
