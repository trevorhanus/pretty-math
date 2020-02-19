import { TokenName as _ } from '../../../internal';

export const PYTHON_SYNTAX = {

    // Constants
    // ---------------------

    'PI': _.pi,

    // Binary Operators
    // ---------------------

    '+': _.Add,
    '=': _.Assign,
    ',': _.Comma,
    '/': _.Divide,
    '*': _.Multiply,
    '**': _.Power,
    '-': _.Subtract,

    // Trig
    // ---------------------

    'acos': _.Acos,
    'asin': _.Asin,
    'atan': _.Atan,
    'acosh': _.Acosh,
    'asinh': _.Asinh,
    'atanh': _.Atanh,
    'cos': _.Cos,
    'cosh': _.Cosh,
    'sin': _.Sin,
    'sinh': _.Sinh,
    'tan': _.Tan,
    'tanh': _.Tanh,

    // Arithmetic Functions
    // ---------------------

    'abs': _.Abs,
    'exp': _.Exp,
    'ln': _.Ln,
    'log': _.Ln,
    'log10': _.Log,
    'Max': _.Max,
    'Min': _.Min,
    'sqrt': _.Sqrt,
    'sum': _.Sum,

    // Calculus
    // ---------------------

    'diff': _.Derivative,
    'integrate': _.Integral,

    // Parens
    // ---------------------

    '(': _.LeftRoundParens,
    ')': _.RightRoundParens,

};
