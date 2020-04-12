import { Block } from 'pretty-math2/model';

export function isRootBlock(block: Block): boolean {
    return block.type === 'root' || block.type === 'root:math';
}

export function getCommonParent(b1: Block, b2: Block): Block {
    if (b1.parent === b2.parent) {
        return b1.parent;
    }

    // at same depth, but parent is not the same
    if (b1.position.depth === b2.position.depth) {
        return getCommonParent(b1.parent, b2.parent);
    }

    // b1 is higher up
    if (b1.position.depth < b2.position.depth) {
        return getCommonParent(b1, b2.parent);
    }

    // b2 is higher up
    return getCommonParent(b1.parent, b2);
}
