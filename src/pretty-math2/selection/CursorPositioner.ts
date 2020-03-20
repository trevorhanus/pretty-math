import { Dir } from 'pretty-math2/interfaces';
import { Block } from 'pretty-math2/model';
import { isRootBlock } from 'pretty-math2/utils/blockUtils';
import { invariant } from '../utils/invariant';

export function getNextCursorPosition(block: Block, dir: Dir): Block {
    invariant(block == null, `getNextCursorPosition invoked without a block.`);

    if (!block) {
        return null;
    }

    switch (dir) {
        case Dir.Left:
            if (block.prev) {
                if (block.prev.isComposite) {
                    const entry = block.prev.entry.fromRight.left;
                    if (entry) {
                        return block.prev.children[entry].end;
                    }
                }
                return block.prev;
            }
            return getNextCursorPositionOutOf(block, dir);
        case Dir.Right:
            if (block.isComposite) {
                const entry = block.entry.fromLeft.right;
                if (entry) {
                    return block.children[entry].start;
                }
            }
            return block.next || getNextCursorPositionOutOf(block, dir);
        case Dir.Up:
            if (block.isComposite) {
                const entry = block.entry.fromLeft.up;
                if (entry) {
                    return block.children[entry].start;
                }
            }
            if (block.prev) {
                if (block.prev.isComposite) {
                    const entry = block.prev.entry.fromRight.up;
                    if (entry) {
                        return block.prev.children[entry].end;
                    }
                }
            }
            return getNextCursorPositionOutOf(block, dir);
        case Dir.Down:
            if (block.isComposite) {
                const entry = block.entry.fromLeft.down;
                if (entry) {
                    return block.children[entry].start;
                }
            }
            if (block.prev) {
                if (block.prev.isComposite) {
                    const entry = block.prev.entry.fromRight.down;
                    if (entry) {
                        return block.prev.children[entry].end;
                    }
                }
            }
            return getNextCursorPositionOutOf(block, dir);
    }
}

export function getNextCursorPositionOutOf(child: Block, dir: Dir): Block {
    const parent = child.list.parent;

    if (!parent || isRootBlock(parent)) return null;

    const leftToRightIndex = parent.cursorOrder.leftToRight.findIndex(val => val === child.list.name);
    const upToDownIndex =  parent.cursorOrder.upToDown.findIndex(val => val === child.list.name);
    switch (dir) {
        case Dir.Left:
            if (leftToRightIndex > 0) {
                const childname = parent.cursorOrder.leftToRight[leftToRightIndex - 1];
                return parent.children[childname].end;
            }
            return parent;
        case Dir.Right:
            if (leftToRightIndex != -1 && leftToRightIndex < parent.cursorOrder.leftToRight.length - 1) {
                const childname = parent.cursorOrder.leftToRight[leftToRightIndex + 1];
                return parent.children[childname].start;
            }
            return parent.next;
        case Dir.Up:
            if (upToDownIndex > 0) {
                const childname = parent.cursorOrder.upToDown[upToDownIndex - 1];
                return parent.children[childname].end;
            }
            return getNextCursorPositionOutOf(parent, dir);
        case Dir.Down:
            if (upToDownIndex != -1 && upToDownIndex < parent.cursorOrder.upToDown.length - 1) {
                const childname = parent.cursorOrder.upToDown[upToDownIndex + 1];
                return parent.children[childname].start;
            }
            return getNextCursorPositionOutOf(parent, dir);
    }
}
