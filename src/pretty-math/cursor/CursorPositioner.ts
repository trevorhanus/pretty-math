import { Dir, exhausted, IBlock, ICursorPosition, isCompositeBlock, isBlankBlock, isRootBlock } from 'pretty-math/internal';

export function getNextCursorPosition(block: IBlock, from: number, dir: Dir): ICursorPosition {
    if (block == null) {
        return null;
    }

    if (from === 0) {
        // from left
        switch (dir) {

            case Dir.Left:
                return block.left ? getNextCursorPosition(block.left, 1, dir) : getNextCursorPositionOutOf(block, dir);

            case Dir.Right:
                if (isCompositeBlock(block)) {
                    const entry = block.getEntryBlock(from, dir);
                    return entry ? leftOf(entry) : rightOf(block);
                }

                if (isBlankBlock(block)) {
                    return getNextCursorPosition(block, 1, dir);
                }

                return block.right ? leftOf(block.right) : rightOf(block);

            case Dir.Up:
                if (isCompositeBlock(block)) {
                    const entry = block.getEntryBlock(from, dir);
                    return entry ? leftOf(entry) : getNextCursorPositionOutOf(block, dir);
                }

                return getNextCursorPositionOutOf(block, dir);

            case Dir.Down:
                if (isCompositeBlock(block)) {
                    const entry = block.getEntryBlock(from, dir);
                    return entry ? leftOf(entry) : getNextCursorPositionOutOf(block, dir);
                }

                return getNextCursorPositionOutOf(block, dir);

            default:
                exhausted(dir);
        }
    }

    // from right
    switch (dir) {

        case Dir.Left:
            if (isCompositeBlock(block)) {
                const entry = block.getEntryBlock(from, dir);
                return entry ? rightOf(entry.chainEnd) : leftOf(block);
            }

            return leftOf(block);

        case Dir.Right:
            return block.right ? getNextCursorPosition(block.right, 0, dir) : getNextCursorPositionOutOf(block, dir);

        case Dir.Up:
            if (isCompositeBlock(block.right)) {
                return getNextCursorPosition(block.right, 0, dir);
            }

            if (isCompositeBlock(block)) {
                const entry = block.getEntryBlock(from, dir);
                return entry ? rightOf(entry.chainEnd) : getNextCursorPositionOutOf(block, dir);
            }

            return getNextCursorPositionOutOf(block, dir);

        case Dir.Down:
            if (isCompositeBlock(block.right)) {
                return getNextCursorPosition(block.right, 0 , dir);
            }

            if (isCompositeBlock(block)) {
                const entry = block.getEntryBlock(from, dir);
                return entry ? rightOf(entry.chainEnd) : getNextCursorPositionOutOf(block, dir);
            }

            return getNextCursorPositionOutOf(block, dir);

        default:
            exhausted(dir);

    }

    return null;
}

export function getNextCursorPositionOutOf(child: IBlock, dir: Dir): ICursorPosition {
    const parent = child.parent;

    if (!parent || isRootBlock(parent)) {
        return null;
    }

    const next = parent.getNextChild(child, dir);

    if (!next) {
        switch (dir) {

            case Dir.Left:
                return leftOf(parent);

            case Dir.Right:
                return rightOf(parent);

            case Dir.Up:
            case Dir.Down:
                return getNextCursorPositionOutOf(parent, dir);

            default:
                exhausted(dir);
        }
    }

    switch (dir) {

        case Dir.Left:
            return rightOf(next.chainEnd);

        case Dir.Right:
            return leftOf(next);

        case Dir.Up:
            return rightOf(next.chainEnd);

        case Dir.Down:
            return leftOf(next);

        default:
            exhausted(dir);
    }

    return null;
}

function leftOf(block: IBlock): ICursorPosition {
    return { block, offset: 0 };
}

function rightOf(block: IBlock): ICursorPosition {
    if (isBlankBlock(block)) {
        return leftOf(block);
    }

    return { block, offset: 1 };
}
