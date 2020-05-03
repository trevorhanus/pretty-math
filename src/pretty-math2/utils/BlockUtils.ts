import { Block } from 'pretty-math2/model';
import { EditorState } from '../model/EditorState';
import { isBinaryOpFam } from 'math';
import { offsetFromAncestor } from './DOMUtils';
import { SelectionRange } from 'pretty-math2/selection/SelectionRange';

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

export function getNumeratorRangeLeftOfBlock(block: Block) {
    if (block == null) return null;

    const sr = new SelectionRange();
    sr.setAnchor(block);
    let cur = block.prev;
    if (cur.type === 'math:right_paren') {
        const parenPair = getLeftParenPair(cur);
        if (parenPair != null) {
            sr.setFocus(parenPair);
        }
    } else if (cur.type === 'atomic') {
        if (!isBinaryOpFam(cur.mathNode)) {
            sr.setFocus(cur);
            cur = cur.prev;
            while (cur != null && !isBinaryOpFam(cur.mathNode)) {
                sr.setFocus(cur);
                cur = cur.prev;
            }
        }
    } else if (cur.type === 'math:supsub') {
        sr.setFocus(cur);
        cur = cur.prev;
        while (cur != null && !isBinaryOpFam(cur.mathNode)) {
            sr.setFocus(cur);
            cur = cur.prev;
        }
    } else if (cur.type === 'math:function' || cur.type === 'math:radical' || cur.type === 'math:fraction') {
        sr.setFocus(cur);
    }
    return sr;
}

export function getLeftParenPair(rightParen: Block) {
    const parenStack = [];
    let next = rightParen.prev;

    while (next != null) {
        if (next.type === 'math:left_paren' && parenStack.length === 0) {
            return next;
        }
        if (next.type === 'math:left_paren') {
            parenStack.pop();
        }
        if (next.type === 'math:right_paren') {
            parenStack.push(next);
        }
        next = next.prev;
    }

    return null;
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
