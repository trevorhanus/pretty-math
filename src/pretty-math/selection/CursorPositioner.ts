import {
    Block,
    BlockList,
    Dir,
    invariant,
    isRootBlock
} from 'pretty-math/internal';

export function getNextCursorPosition(block: Block, dir: Dir): Block {
    invariant(block == null, `getNextCursorPosition invoked without a block.`);

    switch (dir) {
        case Dir.Left:
            if (block.prev) {
                const { prev } = block;
                if (prev.isComposite) {
                    const entryList = getNonNullEntryBlockList(prev, prev.entry.fromRight.left);
                    if (entryList) {
                        return entryList.end;
                    }
                }
                return prev;
            }
            return getNextCursorPositionOutOf(block, dir);
        case Dir.Right:
            if (block.isComposite) {
                const entryList = getNonNullEntryBlockList(block, block.entry.fromLeft.right);
                if (entryList) {
                    return entryList.start;
                }
            }
            return block.next || getNextCursorPositionOutOf(block, dir);
        case Dir.Up:
            if (block.isComposite) {
                const entryList = getNonNullEntryBlockList(block, block.entry.fromLeft.up);
                if (entryList) {
                    return entryList.start;
                }
            }
            if (block.prev) {
                const { prev } = block;
                if (prev.isComposite) {
                    const entryList = getNonNullEntryBlockList(prev, prev.entry.fromRight.up);
                    if (entryList) {
                        return entryList.end;
                    }
                }
            }
            return getNextCursorPositionOutOf(block, dir);
        case Dir.Down:
            if (block.isComposite) {
                const entryList = getNonNullEntryBlockList(block, block.entry.fromLeft.down);
                if (entryList) {
                    return entryList.start;
                }
            }
            if (block.prev) {
                const { prev } = block;
                if (prev.isComposite) {
                    const entryList = getNonNullEntryBlockList(prev, prev.entry.fromRight.down);
                    if (entryList) {
                        return entryList.end;
                    }
                }
            }
            return getNextCursorPositionOutOf(block, dir);
    }
}

export function getNextCursorPositionOutOf(child: Block, dir: Dir): Block {
    const parent = child.list.parent;

    if (!parent || isRootBlock(parent)) return null;

    const list = getNonNullList(parent, child.list.name, dir);
    switch (dir) {
        case Dir.Left:
            if (list) {
                return list.end;
            }
            return parent;
        case Dir.Right:
            if (list) {
                return list.start;
            }
            return parent.next;
        case Dir.Up:
            if (list) {
                return list.end;
            }
            return getNextCursorPositionOutOf(parent, dir);
        case Dir.Down:
            if (list) {
                return list.end;
            }
            return getNextCursorPositionOutOf(parent, dir);
    }
}

function getNonNullList(parent: Block, name: string, dir: Dir): BlockList {
    let direction: string;
    switch (dir) {
        case Dir.Left:
            direction = 'left'
            break;
            
        case Dir.Right:
            direction = 'right'
            break;

        case Dir.Up:
            direction = 'up'
            break;

        case Dir.Down:
            direction = 'down'
            break;
    }
    let childName = parent.cursorOrder[direction][name];
    if (childName) {
        while (parent.childMap[childName].isNull) {
            childName = parent.cursorOrder[direction][childName];
            if (!childName) {
                return null;
            }
        }
    }
    return parent.childMap[childName];
}

function getNonNullEntryBlockList(block: Block, list: string[]): BlockList {
    if (list.length < 1) {
        return null;
    }
    let index = 0;
    while (index < list.length && block.childMap[list[index]].isNull) {
        index++;
    }
    return block.childMap[list[index]];
}
