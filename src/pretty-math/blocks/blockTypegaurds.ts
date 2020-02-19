import {
    BlankBlock,
    BlockType,
    DerivativeBlock,
    ICompositeBlock,
    LeftParensBlock,
    MatrixBlock,
    RightParensBlock,
    RootBlock,
    SupSubBlock
} from 'pretty-math/internal';

export function isBlankBlock(block: any): block is BlankBlock {
    return block != null && block.type === BlockType.Blank;
}

export function isCompositeBlock(block: any): block is ICompositeBlock {
    return block != null && block.isComposite;
}

export function isDerivativeBlock(block: any): block is DerivativeBlock {
    return block != null && block.type === BlockType.Derivative;
}

export function isRootBlock(block: any): block is RootBlock {
    return block != null && block.type === BlockType.Root;
}

export function isLeftParensBlock(block: any): block is LeftParensBlock {
    return block != null && block.type === BlockType.LeftParens;
}

export function isMatrixBlock(block: any): block is MatrixBlock {
    return block && block.type === BlockType.Matrix;
}

export function isRightParensBlock(block: any): block is RightParensBlock {
    return block != null && block.type === BlockType.RightParens;
}

export function isSupSubBlock(block: any): block is SupSubBlock {
    return block != null && block.type === BlockType.SupSub;
}
