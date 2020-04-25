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

export function getTargetedSide(e: MouseEvent | React.MouseEvent, target: HTMLElement): number {
    const localOffset = e.clientX - target.getBoundingClientRect().left;
    const width = target.offsetWidth;

    if (localOffset < 0 || localOffset > width) {
        // out of bounds
        return -1;
    }

    return Math.round(localOffset / width);
}
