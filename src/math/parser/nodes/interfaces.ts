import { Decimal } from 'decimal.js';
import { NodeFamily, Output, Token, TokenName } from '../../internal';

export enum NodeType {
    Operator,
    Operand,
    Parens,
    Root,
}

export enum Assoc {
    Left,
    Right,
}

export enum TrigMode {
    Radians = 'radians',
    Degrees = 'degrees',
}

export type EvalFunction = (args?: INode[], mode?: TrigMode) => INode;

export type ParensDir = 'l' | 'r';

export interface INodeOptions {
    assoc?: Assoc;
    calchub?: string;
    eval?: EvalFunction;
    family?: NodeFamily;
    nArgs?: number;
    parens?: string;
    parensDir?: ParensDir;
    parensPair?: string;
    prec?: number;
    python?: string;
    symbol?: string;
    token?: Token;
}

export type StringOutput = Output<INode>;
export type LocalSymbolMap = { [symbol: string]: true };

export interface INode {
    __isNode: true;
    type: NodeType;
    children: INode[];
    decimal: Decimal;
    family: NodeFamily;
    isAccessible: boolean;
    isSymbol: boolean;
    isSymbolic: boolean;
    left: INode;
    localSymbols: LocalSymbolMap;
    opts: INodeOptions;
    parent: INode;
    primitiveNumber: number;
    right: INode;
    root: INode;
    token: Token;
    tokenEnd: number;
    tokenName: TokenName;
    tokenStart: number;
    tokenLength: number;
    tokenValue: string;
    addChild(node: INode): void;
    clone(): INode;
    cloneDeep(): INode;
    forEach(iterator: (node: INode) => void): void;
    replaceChild(child: INode, newChild: INode): void;
    setChildren(args: INode[]): void;
    setLocalSymbols(map: LocalSymbolMap): void;
    setParent(node: INode): void;
    simplify(opts?: SimplifyNodeOpts): INode;
    toCalchub(): StringOutput;
    toPython(): StringOutput;
    toShorthand(): any;
}

export interface IOperatorNode extends INode {
    argNodes: INode[];
    assoc: Assoc;
    isLeftAssoc: boolean;
    isRightAssoc: boolean;
    nArgs: number;
    prec: number;
}

export interface ISymbolNode extends INode {
    __isLocal: boolean;
    readonly isLocal: boolean;
    pythonSafeSymbol: string;
    symbol: string;
    cloneWithNewSymbol(newSymbol: string): ISymbolNode;
}

export interface SimplifyNodeOpts {
    trigMode?: TrigMode;
}
