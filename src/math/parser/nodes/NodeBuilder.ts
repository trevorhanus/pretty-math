import {
    ArrayNode,
    AssignmentNode,
    Assoc,
    CommaNode,
    ConstantNode,
    Constants as C,
    DerivativeNode,
    FuncDefinitionNode,
    INode,
    INodeOptions,
    IntegralNode,
    LiteralNode,
    MatrixNode,
    MissingNode,
    NodeFamily,
    OperatorNode,
    ParensNode,
    PowerNode,
    SymbolNode,
    Token,
    TokenName,
} from '../../internal';
import * as f from '../functions';

interface NodeConstructor {
    new (opts: INodeOptions): INode;
}

export type NodeMap = {
    [prop in TokenName]: [ NodeConstructor, INodeOptions ];
}

const { Right, Left } = Assoc;
const _ = TokenName;
const {
    BinaryOp,
    Constant,
    Func,
    LeftParens,
    Literal,
    Missing,
    RightParens,
    Symbol,
    UnaryOp,
} = NodeFamily;

export const TOKEN_TO_NODE: NodeMap = {

    [_.Missing]:    [ MissingNode,      { family: Missing,   calchub: '',   python: '' } ],
    [_.Space]: null,

    // Constants
    // ---------------------

    [_.e]:          [ ConstantNode,    { family: Constant,   eval: C.expontential, calchub: 'e',       python: 'e'  } ],
    [_.pi]:         [ ConstantNode,    { family: Constant,   eval: C.pi,           calchub: '\\pi',    python: 'PI' } ],
    [_.Infinity]:   [ ConstantNode,    { family: Constant,   eval: C.infinity,     calchub: '\\inf',   python: 'oo' } ],

    // Unary Operators
    // ---------------------

    [_.Factorial]:  [ OperatorNode,    { family: UnaryOp,      prec: 7,  assoc: Left,   nArgs: 1,   eval: f.factorial,   calchub: '$0!',      python: '$0!' } ],
    [_.Negate]:     [ OperatorNode,    { family: UnaryOp,      prec: 6,  assoc: Right,  nArgs: 1,   eval: f.unaryMinus,   calchub: '-$0',      python: '-$0' } ],

    // binary operators
    [_.Add]:        [ OperatorNode,    { family: BinaryOp,     prec: 2,  assoc: Left,   nArgs: 2,   eval: f.add,          calchub: '$0+$1',    python: '$0+$1' } ],
    [_.Assign]:     [ AssignmentNode,  { family: BinaryOp,     prec: 1,  assoc: Right,  nArgs: 2,   eval: null,           calchub: '$0=$1',    python: '$0 = $1' } ],
    [_.Comma]:      [ CommaNode,       { family: BinaryOp,     prec: 1,  assoc: Right,  nArgs: 2,   eval: null,           calchub: '$0,$1',    python: '$0,$1' } ],
    [_.Divide]:     [ OperatorNode,    { family: BinaryOp,     prec: 3,  assoc: Left,   nArgs: 2,   eval: f.divide,       calchub: '$0/$1',    python: '$0/$1' } ],
    [_.ImplMultiply]: [ OperatorNode,  { family: BinaryOp,     prec: 3,  assoc: Right,  nArgs: 2,   eval: f.multiply,     calchub: '$0 $1',    python: '$0*$1' } ],
    [_.Multiply]:   [ OperatorNode,    { family: BinaryOp,     prec: 3,  assoc: Left,   nArgs: 2,   eval: f.multiply,     calchub: '$0*$1',    python: '$0*$1' } ],
    [_.Power]:      [ PowerNode,       { family: BinaryOp,     prec: 4,  assoc: Right,  nArgs: 2,   eval: f.pow,          calchub: '$0^{$1}',  python: '$0**$1' } ],
    [_.Subtract]:   [ OperatorNode,    { family: BinaryOp,     prec: 2,  assoc: Left,   nArgs: 2,   eval: f.subtract,     calchub: '$0-$1',    python: '$0-$1' } ],

    // trig functions
    [_.Acos]:       [ OperatorNode,    { family: Func,      prec: 6,  assoc: Right,   nArgs: 1,  eval: f.acos,          calchub: '\\arccos{$0}',   python: 'acos($0)' } ],
    [_.Asin]:       [ OperatorNode,    { family: Func,      prec: 6,  assoc: Right,   nArgs: 1,  eval: f.asin,          calchub: '\\arcsin{$0}',   python: 'asin($0)' } ],
    [_.Atan]:       [ OperatorNode,    { family: Func,      prec: 6,  assoc: Right,   nArgs: 1,  eval: f.atan,          calchub: '\\arctan{$0}',   python: 'atan($0)' } ],
    [_.Acosh]:      [ OperatorNode,    { family: Func,      prec: 6,  assoc: Right,   nArgs: 1,  eval: f.acosh,         calchub: '\\chacosh{$0}',  python: 'acosh($0)' } ],
    [_.Asinh]:      [ OperatorNode,    { family: Func,      prec: 6,  assoc: Right,   nArgs: 1,  eval: f.asinh,         calchub: '\\chasinh{$0}',  python: 'asinh($0)' } ],
    [_.Atanh]:      [ OperatorNode,    { family: Func,      prec: 6,  assoc: Right,   nArgs: 1,  eval: f.atanh,         calchub: '\\chatanh{$0}',  python: 'atanh($0)' } ],
    [_.Cos]:        [ OperatorNode,    { family: Func,      prec: 6,  assoc: Right,   nArgs: 1,  eval: f.cos,           calchub: '\\cos{$0}',      python: 'cos($0)' } ],
    [_.Cosh]:       [ OperatorNode,    { family: Func,      prec: 6,  assoc: Right,   nArgs: 1,  eval: f.cosh,          calchub: '\\cosh{$0}',     python: 'cosh($0)' } ],
    [_.Sin]:        [ OperatorNode,    { family: Func,      prec: 6,  assoc: Right,   nArgs: 1,  eval: f.sin,           calchub: '\\sin{$0}',      python: 'sin($0)' } ],
    [_.Sinh]:       [ OperatorNode,    { family: Func,      prec: 6,  assoc: Right,   nArgs: 1,  eval: f.sinh,          calchub: '\\sinh{$0}',     python: 'sinh($0)' } ],
    [_.Tan]:        [ OperatorNode,    { family: Func,      prec: 6,  assoc: Right,   nArgs: 1,  eval: f.tan,           calchub: '\\tan{$0}',      python: 'tan($0)' } ],
    [_.Tanh]:       [ OperatorNode,    { family: Func,      prec: 6,  assoc: Right,   nArgs: 1,  eval: f.tanh,          calchub: '\\tanh{$0}',     python: 'tanh($0)' } ],

    // Arithmetic Functions
    // ---------------------

    [_.Abs]:        [ OperatorNode,    { family: Func,      prec: 6,  assoc: Right,   nArgs: 1,   eval: f.abs,          calchub: '\\chabs{$0}',    python: 'Abs($0)' } ],
    [_.Exp]:        [ OperatorNode,    { family: Func,      prec: 6,  assoc: Right,   nArgs: 1,   eval: f.exp,          calchub: '\\exp{$0}',      python: 'exp($0)' } ],
    [_.Frac]:       [ OperatorNode,    { family: Func,      prec: 6,  assoc: Right,   nArgs: 1,   eval: f.divide,       calchub: '\\frac{$0}',     python: '($0)/($1)' } ],
    [_.Ln]:         [ OperatorNode,    { family: Func,      prec: 6,  assoc: Right,   nArgs: 1,   eval: f.ln,           calchub: '\\ln{$0}',       python: 'ln($0)' } ],
    [_.Log]:        [ OperatorNode,    { family: Func,      prec: 6,  assoc: Right,   nArgs: 1,   eval: f.log,          calchub: '\\log{$0}',      python: 'log10($0)' } ],
    [_.Max]:        [ OperatorNode,    { family: Func,      prec: 6,  assoc: Right,   nArgs: 1,   eval: f.max,          calchub: '\\chmax{$0}',    python: 'Max($0)' } ],
    [_.Min]:        [ OperatorNode,    { family: Func,      prec: 6,  assoc: Right,   nArgs: 1,   eval: f.min,          calchub: '\\chmin{$0}',    python: 'Min($0)' } ],
    [_.Sqrt]:       [ OperatorNode,    { family: Func,      prec: 6,  assoc: Right,   nArgs: 1,   eval: f.sqrt,         calchub: '\\sqrt{$0}',     python: 'sqrt($0)' } ],
    [_.Sum]:        [ OperatorNode,    { family: Func,      prec: 6,  assoc: Right,   nArgs: 1,   eval: f.sum,          calchub: '\\chsum{$0}',    python: 'sum($0)' } ],

    // Linear Algebra
    // ---------------------

    [_.Matrix]:     [ MatrixNode,      { family: Func,      prec: 6,  assoc: Right,   nArgs: 1,   eval: null,           calchub: '\\matrix{$0}',   python: 'matrix($0)' }],
    [_.CrossP]:     [ OperatorNode,    { family: BinaryOp,  prec: 6,  assoc: Left,    nArgs: 2,   eval: f.crossProduct, calchub: '$0 \\crossp $1', python: '' }],
    [_.DotP]:       [ OperatorNode,    { family: BinaryOp,  prec: 6,  assoc: Left,    nArgs: 2,   eval: f.dotProduct,   calchub: '$0 \\dotp $1',   python: '' }],
    [_.Transpose]:  [ OperatorNode,    { family: Func,      prec: 6,  assoc: Right,   nArgs: 1,   eval: f.transpose,    calchub: '\\transpose{$0}',python: 'transpose($0)' }],

    // Unique to CalcHub
    // ---------------------

    [_.Dfunc]:          [ FuncDefinitionNode, { family: Func,     prec: 6,  assoc: Right,   nArgs: 1,   eval: null,       calchub: '\\dfunc{$0}',    python: 'define($0)' } ],
    [_.UserDefinedFunc]:[ OperatorNode,       { family: Func,     prec: 6,  assoc: Right,   nArgs: 1,   eval: null,       calchub: null,             python: null } ],

    // Calculus
    // ---------------------

    [_.Derivative]: [ DerivativeNode,  { family: Func,      prec: 6,  assoc: Right,   nArgs: 1,   eval: null,           calchub: '\\diff{$0}',    python: 'diff($0)' } ],
    [_.Integral]:   [ IntegralNode,    { family: Func,      prec: 6,  assoc: Right,   nArgs: 1,   eval: null,           calchub: '\\int{$0}',     python: 'integral($0)' } ],
    [_.Pwrt]:       [ OperatorNode,    { family: Func,      prec: 6,  assoc: Right,   nArgs: 1,   eval: null,           calchub: '\\pwrt{$0}',    python: '$0' } ],
    [_.Wrt]:        [ OperatorNode,    { family: Func,      prec: 6,  assoc: Right,   nArgs: 1,   eval: null,           calchub: '\\wrt{$0}',     python: '$0' } ],

    // Arrays
    // ---------------------

    [_.Array]:                  [ ArrayNode,    { family: null } ],
    [_.ArrayOpener]:            [ ParensNode,   { family: LeftParens,    parens: '[',    parensPair: ']' } ],
    [_.ArrayCloser]:            [ ParensNode,   { family: RightParens,   parens: ']',    parensPair: '[' } ],

    // Parens
    // ---------------------

    [_.EscapedLeftCurlyParens]: [ ParensNode,   { family: LeftParens,    parens: '\\{',  parensPair: '\\}' }],
    [_.LeftCurlyParens]:        [ ParensNode,   { family: LeftParens,    parens: '{',    parensPair: '}' } ],
    [_.LeftRoundParens]:        [ ParensNode,   { family: LeftParens,    parens: '(',    parensPair: ')' } ],
    [_.EscapedRightCurlyParens]:[ ParensNode,   { family: RightParens,   parens: '\\}',  parensPair: '\\{' }],
    [_.RightCurlyParens]:       [ ParensNode,   { family: RightParens,   parens: '}',    parensPair: '{' } ],
    [_.RightRoundParens]:       [ ParensNode,   { family: RightParens,   parens: ')',    parensPair: '(' } ],

    // Operands
    // --------------------
    
    [_.Literal]:            [ LiteralNode,  { family: Literal } ],
    [_.Symbol]:             [ SymbolNode,   { family: Symbol } ],

    // Greeks
    // --------------------

    [_.alpha]:      [ SymbolNode, { family: Symbol, calchub: '\\alpha' } ],
    [_.beta]:       [ SymbolNode, { family: Symbol, calchub: '\\beta' } ],
    [_.gamma]:      [ SymbolNode, { family: Symbol, calchub: '\\gamma' } ],
    [_.delta]:      [ SymbolNode, { family: Symbol, calchub: '\\delta' } ],
    [_.epsilon]:    [ SymbolNode, { family: Symbol, calchub: '\\epsilon' } ],
    [_.zeta]:       [ SymbolNode, { family: Symbol, calchub: '\\zeta' } ],
    [_.eta]:        [ SymbolNode, { family: Symbol, calchub: '\\eta' } ],
    [_.theta]:      [ SymbolNode, { family: Symbol, calchub: '\\theta' } ],
    [_.kappa]:      [ SymbolNode, { family: Symbol, calchub: '\\kappa' } ],
    [_.lambda]:     [ SymbolNode, { family: Symbol, calchub: '\\lambda' } ],
    [_.mu]:         [ SymbolNode, { family: Symbol, calchub: '\\mu' } ],
    [_.nu]:         [ SymbolNode, { family: Symbol, calchub: '\\nu' } ],
    [_.xi]:         [ SymbolNode, { family: Symbol, calchub: '\\xi' } ],
    [_.rho]:        [ SymbolNode, { family: Symbol, calchub: '\\rho' } ],
    [_.sigma]:      [ SymbolNode, { family: Symbol, calchub: '\\sigma' } ],
    [_.tau]:        [ SymbolNode, { family: Symbol, calchub: '\\tau' } ],
    [_.upsilon]:    [ SymbolNode, { family: Symbol, calchub: '\\upsilon' } ],
    [_.phi]:        [ SymbolNode, { family: Symbol, calchub: '\\phi' } ],
    [_.chi]:        [ SymbolNode, { family: Symbol, calchub: '\\chi' } ],
    [_.psi]:        [ SymbolNode, { family: Symbol, calchub: '\\psi' } ],
    [_.omega]:      [ SymbolNode, { family: Symbol, calchub: '\\omega' } ],

    [_.Gamma]:      [ SymbolNode, { family: Symbol, calchub: '\\Gamma' } ],
    [_.Delta]:      [ SymbolNode, { family: Symbol, calchub: '\\Delta' } ],
    [_.Theta]:      [ SymbolNode, { family: Symbol, calchub: '\\Theta' } ],
    [_.Lambda]:     [ SymbolNode, { family: Symbol, calchub: '\\Lambda' } ],
    [_.Xi]:         [ SymbolNode, { family: Symbol, calchub: '\\Xi' } ],
    [_.Pi]:         [ SymbolNode, { family: Symbol, calchub: '\\Pi' } ],
    [_.Sigma]:      [ SymbolNode, { family: Symbol, calchub: '\\Sigma' } ],
    [_.Upsilon]:    [ SymbolNode, { family: Symbol, calchub: '\\Upsilon' } ],
    [_.Phi]:        [ SymbolNode, { family: Symbol, calchub: '\\Phi' } ],
    [_.Psi]:        [ SymbolNode, { family: Symbol, calchub: '\\Psi' } ],
    [_.Omega]:      [ SymbolNode, { family: Symbol, calchub: '\\Omega' } ],

};

export function buildNode(token: Token): INode {
    const config = TOKEN_TO_NODE[token.name];

    if (!config) {
        console.warn(`Could not find configuartion for tokenName ${token.name}`);
        return null;
    }

    const [ Constructor, opts ] = config;
    return new Constructor({ ...opts, token });
}

export function buildImplMultiplyNode(): OperatorNode {
    const token = new Token(TokenName.ImplMultiply, '\u229B', -1);
    return buildNode(token) as OperatorNode;
}
