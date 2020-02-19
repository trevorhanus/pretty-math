import { Token, TokenName, UC } from '../../internal';

const _ = TokenName;

type f = (t: Token) => string;
export const TOKEN_SHORTHANDS: { [name in TokenName]: string | f } = {
    [_.Missing]: '?',
    [_.Space]: ' ',

    // Constants
    // ---------------------

    [_.e]: 'c:e',
    [_.pi]: (t: Token) => `c:${t.value}`,
    [_.Infinity]: UC.Infinity,

    // Unary Operators
    // ---------------------

    [_.Factorial]: '!',
    [_.Negate]: 'neg',

    // Binary Operators
    // ---------------------

    [_.Add]: '+',
    [_.Assign]: '=',
    [_.Comma]: ',',
    [_.Divide]: '/',
    [_.ImplMultiply]: '\u229B',
    [_.Multiply]: '*',
    [_.Power]: '^',
    [_.Subtract]: '-',

    // Trig
    // ---------------------

    [_.Acos]: 'acos',
    [_.Asin]: 'asin',
    [_.Atan]: 'atan',
    [_.Acosh]: 'acosh',
    [_.Asinh]: 'asinh',
    [_.Atanh]: 'atanh',
    [_.Cos]: 'cos',
    [_.Cosh]: 'cosh',
    [_.Sin]: 'sin',
    [_.Sinh]: 'sinh',
    [_.Tan]: 'tan',
    [_.Tanh]: 'tanh',

    // Arithmetic Functions
    // ---------------------

    [_.Abs]: 'abs',
    [_.Exp]: 'eap',
    [_.Frac]: 'frac',
    [_.Ln]: 'ln',
    [_.Log]: 'log',
    [_.Max]: 'max',
    [_.Min]: 'min',
    [_.Sqrt]: 'sqrt',
    [_.Sum]: 'sum',

    // Unique to CalcHub
    // ---------------------

    [_.Dfunc]: 'dfunc',
    [_.UserDefinedFunc]: (t: Token) => `udf:${t.value}`,

    // Linear Algebra
    // ---------------------

    [_.Matrix]: 'matrix',
    [_.CrossP]: 'x',
    [_.DotP]: 'dot',
    [_.Transpose]: 'T',

    // Calculus
    // ---------------------

    [_.Derivative]: 'diff',
    [_.Integral]: 'int',
    [_.Pwrt]: 'pwrt',
    [_.Wrt]: 'wrt',

    // Array
    // ---------------------
    [_.Array]: '[]',
    [_.ArrayOpener]: '[',
    [_.ArrayCloser]: ']',

    // Parens
    // ---------------------

    [_.EscapedLeftCurlyParens]: '\\{',
    [_.EscapedRightCurlyParens]: '\\}',
    [_.LeftCurlyParens]: '{',
    [_.LeftRoundParens]: '(',
    [_.RightCurlyParens]: '}',
    [_.RightRoundParens]: ')',

    // Operands
    // --------------------

    [_.Literal]: (t: Token) => `l:${t.value}`,
    [_.Symbol]: (t: Token) => `s:${t.value}`,

    // Greeks
    // --------------------

    [_.alpha]: 'g:alpha',
    [_.beta]: 'g:beta',
    [_.gamma]: 'g:gamma',
    [_.delta]: 'g:delta',
    [_.epsilon]: 'g:epsilon',
    [_.zeta]: 'g:zeta',
    [_.eta]: 'g:eta',
    [_.theta]: 'g:theta',
    [_.kappa]: 'g:kappa',
    [_.lambda]: 'g:lambda',
    [_.mu]: 'g:mu',
    [_.nu]: 'g:nu',
    [_.xi]: 'g:xi',
    [_.rho]: 'g:rho',
    [_.sigma]: 'g:sigma',
    [_.tau]: 'g:tau',
    [_.upsilon]: 'g:upsilon',
    [_.phi]: 'g:phi',
    [_.chi]: 'g:chi',
    [_.psi]: 'g:psi',
    [_.omega]: 'g:omega',

    [_.Gamma]: 'g:Gamma',
    [_.Delta]: 'g:Delta',
    [_.Theta]: 'g:Theta',
    [_.Lambda]: 'g:Lambda',
    [_.Xi]: 'g:Xi',
    [_.Pi]: 'g:Pi',
    [_.Sigma]: 'g:Sigma',
    [_.Upsilon]: 'g:Upsilon',
    [_.Phi]: 'g:Phi',
    [_.Psi]: 'g:Psi',
    [_.Omega]: 'g:Omega',
};

export function toShorthand(tokens: Token[]): string {
    return tokens.map(token => {
        const sOrF = TOKEN_SHORTHANDS[token.name];
        let s = typeof sOrF === 'string' ? sOrF : sOrF(token);
        return `[${s}]`;
    }).join(' ');
}
