import { Block } from 'pretty-math2/model';
import { EditorState } from '../model/EditorState';
import { offsetFromAncestor } from './DOMUtils';

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

export function walkTree(block: Block, iterator: (block: Block) => void) {
    if (!block) {
        return;
    }

    iterator(block);

    if (block.isComposite) {
        block.children.forEach(list => {
            list.blocks.forEach(block => {
                walkTree(block, iterator);
            });
        });
    }
}

export function findClosestBlock(editor: EditorState, e: React.MouseEvent): Block {
    const containerRef = editor.containerRef.current;

    if (!containerRef) {
        return null;
    }

    const containerClientRect = containerRef.getBoundingClientRect();

    if (!isInside(e, containerClientRect)) {
        return null;
    }

    const relPoint = calculateRelativePoint(e, containerClientRect);

    let closestBlock = null;
    let leastDist = null;

    walkTree(editor.root.childMap.inner.start, block => {
        const blockOffset = offsetFromAncestor(containerRef, block.ref.current);
        const dist = distanceBetween(relPoint, { x: blockOffset.offsetLeft, y: blockOffset.offsetTop });

        if (!leastDist) {
            leastDist = dist;
        }

        if (dist <= leastDist) {
            leastDist = dist;
            closestBlock = block;
        }
    });

    return closestBlock;
}

export interface Point {
    x: number,
    y: number,
}

function calculateRelativePoint(e: React.MouseEvent, rect: DOMRect): Point {
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    }
}

function distanceBetween(p1: Point, p2: Point): number {
    const x = Math.pow(p2.x - p1.x, 2);
    const y = Math.pow(p2.y - p1.y, 2);
    return Math.sqrt(x + y);
}

function isInside(e: React.MouseEvent, rect: DOMRect): boolean {
    const { clientX, clientY } = e;
    return clientX > rect.left
        && clientX < rect.right
        && clientY > rect.top
        && clientY < rect.bottom;
}
