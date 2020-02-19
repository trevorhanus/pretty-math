import { TokenName as _ } from '../../../internal';

export const CALCHUB_SYNTAX = {

    // Constants
    // ---------------------

    '\\pi': _.pi,
    'e': _.e,
    '\\inf': _.Infinity,

    // Unary Operators
    // ---------------------

    '!': _.Factorial,

    // Binary Operators
    // ---------------------

    '+': _.Add,
    '=': _.Assign,
    ',': _.Comma,
    '/': _.Divide,
    '*': _.Multiply,
    '^': _.Power,
    '-': _.Subtract,
    '\\cdot': _.Multiply,

    // Trig
    // ---------------------

    '\\arccos': _.Acos,
    '\\arcsin': _.Asin,
    '\\arctan': _.Atan,
    '\\chacosh': _.Acosh,
    '\\chasinh': _.Asinh,
    '\\chatanh': _.Atanh,
    '\\cos': _.Cos,
    '\\cosh': _.Cosh,
    '\\sin': _.Sin,
    '\\sinh': _.Sinh,
    '\\tan': _.Tan,
    '\\tanh': _.Tanh,

    // Arithmetic Functions
    // ---------------------

    '\\chabs': _.Abs,
    '\\exp': _.Exp,
    '\\frac': _.Frac,
    '\\ln': _.Ln,
    '\\log': _.Log,
    '\\chmax': _.Max,
    '\\chmin': _.Min,
    '\\sqrt': _.Sqrt,
    '\\chsum': _.Sum,

    // Calculus
    // ---------------------

    '\\diff': _.Derivative,
    '\\int': _.Integral,
    '\\pwrt': _.Pwrt,
    '\\wrt': _.Wrt,

    // Linear Algebra
    '\\matrix': _.Matrix,
    '\\crossp': _.CrossP,
    '\\dotp': _.DotP,
    '\\transpose': _.Transpose,

    // Calchub
    // ---------------------

    '\\dfunc': _.Dfunc,

    // Parens
    // ---------------------

    '[': _.ArrayOpener,
    ']': _.ArrayCloser,
    '\\{': _.EscapedLeftCurlyParens,
    '{': _.LeftCurlyParens,
    '(': _.LeftRoundParens,
    '\\}': _.EscapedRightCurlyParens,
    '}': _.RightCurlyParens,
    ')': _.RightRoundParens,

    // Greeks
    // ---------------------

    '\\alpha': _.alpha,
    '\\beta': _.beta,
    '\\gamma': _.gamma,
    '\\delta': _.delta,
    '\\epsilon': _.epsilon,
    '\\zeta': _.zeta,
    '\\eta': _.eta,
    '\\theta': _.theta,
    '\\kappa': _.kappa,
    '\\lambda': _.lambda,
    '\\mu': _.mu,
    '\\nu': _.nu,
    '\\xi': _.xi,
    '\\rho': _.rho,
    '\\sigma': _.sigma,
    '\\tau': _.tau,
    '\\upsilon': _.upsilon,
    '\\phi': _.phi,
    '\\chi': _.chi,
    '\\psi': _.psi,
    '\\omega': _.omega,

    '\\Gamma': _.Gamma,
    '\\Delta': _.Delta,
    '\\Theta': _.Theta,
    '\\Lambda': _.Lambda,
    '\\Xi': _.Xi,
    '\\Pi': _.Pi,
    '\\Sigma': _.Sigma,
    '\\Upsilon': _.Upsilon,
    '\\Phi': _.Phi,
    '\\Psi': _.Psi,
    '\\Omega': _.Omega,

};
