import { INode, MathContext } from 'math';
import { BlockChain, ICursorPosition } from 'pretty-math/internal';
import { Output } from 'pretty-math/utils';
import { BlockPosition } from 'pretty-math/utils/BlockPosition';
import { CSSProperties } from 'react';

export enum BlockType {
    Blank = 'blank',
    Block = 'block',
    DefineFunction = 'u-function',
    Derivative = 'derivative',
    Differential = 'differential',
    ExprEval = 'expr-eval',
    Fraction = 'fraction',
    Function = 'function',
    Integral = 'integral',
    LeftParens = 'left-parens',
    Matrix = 'matrix',
    Radical = 'radical',
    RightParens = 'right-parens',
    Root = 'root',
    SupSub = 'sup-sub',
}

export interface IBlockState {
    type: BlockType;
    id?: string;
    text?: string;
    latex?: string;
    blocks?: BlockChainState; // root
    num?: BlockChainState; // for Fraction
    denom?: BlockChainState; // for Fraction
    funcName?: BlockChainState; // for UserDefinedFunctions
    inner?: BlockChainState; // for Radical
    rightBound?: BlockChainState; // for Integral
    leftBound?: BlockChainState; // for Integral
    rows?: BlockChainState[][]; // Matrix
    sup?: BlockChainState; // SupSub
    sub?: BlockChainState; // SupSub
    wrt?: BlockChainState; // Derivative
}

export interface RootBlockState {
    id?: string;
    type: BlockType;
    blocks: BlockChainState;
}

export type BlockChainState = IBlockState[];

export interface MathFieldState {
    root: RootBlockState;
    selection?: ISelectionState;
}

export interface ISelectionState {
    start: {
        blockId: string;
        offset: number;
    },
    end: {
        blockId: string;
        offset: number;
    }
}

export interface EngineWithDecorator {
    decorator: IDecorator;
}

export interface IBlock {
    id: string;
    chainEnd: IBlock;
    chainLength: number;
    chainNumber: number;
    chainStart: IBlock;
    decor: IBlockDecor;
    depth: number;
    engine: EngineWithDecorator;
    isChainEnd: boolean;
    isChainStart: boolean;
    isComposite: boolean;
    isRoot: boolean;
    left: IBlock;
    mathCxt: MathContext;
    node: INode;
    parent: ICompositeBlock;
    position: BlockPosition;
    ref: HTMLElement;
    right: IBlock;
    root: IBlock;
    text: string;
    type: BlockType;
    clone(): IBlock;
    cloneDeep(): IBlock;
    contains(block: IBlock): boolean;
    containsShallow(block: IBlock): boolean;
    forEachBlock(iterator: (block: IBlock) => void): void;
    getBlockById(id: string): IBlock;
    getCursorPositionAt(offset: number): ICursorPosition;
    insertAt(blockChain: IBlock, offset: number): ICursorPosition;
    insertChainLeft(blockChain: IBlock): void;
    insertChainRight(blockChain: IBlock): void;
    remove(): void;
    removeNext(fromOffset: number): ICursorPosition;
    removeNextRight(fromOffset: number): ICursorPosition;
    replaceEntireChain(newChain: IBlock): void;
    replaceWith(blockChain: IBlock): void;
    setLeft(block: IBlock): void;
    setParent(block: IBlock, chainNumber: number): void;
    setRight(block: IBlock): void;
    splitAt(offset: number): void;
    toCalchub(): string;
    toCalchubOutput(): Output;
    toJS(): BlockChainState;
    toJSShallow(): IBlockState;
    toShorthand(): any[]; // for dev purposes
}

export interface ICompositeBlock extends IBlock {
    isComposite: true;
    chains: BlockChain[];
    children: IBlock[];
    contains(block: IBlock): boolean;
    getChainAtChainPosition(chainPosition: number): BlockChain;
    getEntryBlock(from: number, dir: Dir): IBlock;
    getNextChild(child: IBlock, dir: Dir): IBlock;
    isInside(block: IBlock): boolean;
    isInsideInclusive(block: IBlock): boolean;
    removeChild(child: IBlock): ICursorPosition;
    removeNextOutOfChild(dir: Dir, child: IBlock): ICursorPosition;
    replaceChild(oldChild: IBlock, newChild: IBlock): void;
}

export enum Dir {
    Up,
    Right,
    Down,
    Left,
}

export interface IEventHandler {
    lastAction: Action;
    backspace(): void;
    backspaceAll(): void;
    delete(): void;
    down(): void;
    insertText(text: string): void;
    left(): void;
    moveSelectionToEnd(): void;
    moveSelectionToStart(): void;
    pasteData(data: string): void;
    return(): void;
    resetLastAction(): void;
    right(): void;
    selectAll(): void;
    selectDown(): void;
    selectLeft(): void;
    selectRight(): void;
    selectUp(): void;
    selectToStart(): void;
    selectToEnd(): void;
    tab(e: React.KeyboardEvent): void;
    up(): void;
}

export enum Action {
    Insert = 'insert',
    Delete = 'delete',
    Select = 'select',
    MoveCursor = 'move_cursor',
}

export interface IBlockDecor {
    className: string;
    displayValueOverride: string;
    style: CSSProperties;
    node?: INode; // only on blocks in a math tree
}

export interface IDecorator {
    getDecorForBlock(block: IBlock): IBlockDecor;
}
