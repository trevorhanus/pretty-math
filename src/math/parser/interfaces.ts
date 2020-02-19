import { INode, MathSyntaxError, RootNode, Token } from '../internal';

export type NodeSourceMap = { [charIndex: number]: INode };

export interface TokenizeResult {
    error: MathSyntaxError;
    input: string;
    tokens: Token[];
    warnings: MathWarning[];
}

export interface ParseResult {
    error: MathSyntaxError;
    input: string;
    root: RootNode;
    sourceMap: NodeSourceMap;
    tokens: Token[];
    warnings: MathWarning[];
}

export interface MathWarning {
    message: string;
    start?: number;
    end?: number;
}

export enum NodeFamily {
    BinaryOp,
    Constant,
    Func,
    Invalid,
    LeftParens,
    Literal,
    Missing,
    Reserved,
    RightParens,
    Symbol,
    TableRange,
    UnaryOp,
}
