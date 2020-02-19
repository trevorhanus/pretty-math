import { isBinaryOpFam } from 'math';
import { runInAction } from 'mobx';
import {
    BlockBuilder,
    BlockChainState,
    BlockType,
    buildChainFromCalchub,
    calchubFromChain,
    CursorPosition,
    FractionBlock,
    getBlockAtPosition,
    IBlock,
    IBlockState,
    ICursorPosition,
    isMatrixBlock,
    isSupSubBlock,
    LibraryEntry,
    MatrixBlock,
    Range,
    RightParensBlock,
    Selection,
    warn
} from 'pretty-math/internal';

export function removeRange(range: Range): ICursorPosition {
    return runInAction(() => {

        if (range.isEmpty || range.isCollapsed) {
            return null;
        }

        let startBlock = range.start.offset === 0 ? range.start.block : range.start.block.right;
        let endBlock = range.end.offset === 1 ? range.end.block : range.end.block.left;

        if (startBlock === endBlock) {
            return startBlock.removeNext(1);
        }

        // whole chain
        if (startBlock.isChainStart && endBlock.isChainEnd) {

            if (startBlock.parent == null) {
                // this should never happen, expect in tests sometimes
                warn('invariant: a block does not have a parent.');
                return null;
            }

            return startBlock.parent.removeChild(startBlock);
        }

        // start of chain
        if (startBlock.isChainStart) {
            const newStart = endBlock.right;
            endBlock.splitAt(1);
            startBlock.parent.replaceChild(startBlock, newStart);
            return {
                block: newStart,
                offset: 0,
            }
        }

        // end of chain
        if (endBlock.isChainEnd) {
            const newEnd = startBlock.left;
            newEnd.setRight(null);
            return {
                block: newEnd,
                offset: 1,
            }
        }

        // must be in the middle of a chain
        const left = startBlock.left;
        const right = endBlock.right;

        startBlock.splitAt(0);
        endBlock.splitAt(1);

        left.insertChainRight(right);

        return {
            block: left,
            offset: 1,
        }
    });
}

export function getCalchubForRange(range: Range): string {
    if (range.isEmpty || range.isCollapsed) {
        return '';
    }

    const startBlock = range.start.offset === 0 ? range.start.block : range.start.block.right;
    const endBlock = range.end.offset === 1 ? range.end.block : range.end.block.left;

    let currentBlock = startBlock;
    let calchub = currentBlock.toCalchub();

    while (currentBlock !== endBlock && currentBlock.right) {
        calchub += currentBlock.right.toCalchub();
        currentBlock = currentBlock.right;
    }

    return calchub;
}

export function replaceFocusedTokenWithLibraryEntry(selection: Selection, entry: LibraryEntry) {
    replaceRangeWithLibraryEntry(selection, selection.focusedTokenRange, entry);
}

export function replaceRangeWithLibraryEntry(selection: Selection, range: Range, entry: LibraryEntry) {
    if (entry == null || range == null) {
        return;
    }

    const { autocomplete, latex, cursorOnInsert } = entry;

    const replacementChain = buildReplacementChain(autocomplete || latex);

    let nextCursorPosition = { block: replacementChain.chainEnd, offset: 1 };

    if (cursorOnInsert) {
        const { blockPos, offset } = cursorOnInsert;
        const block = getBlockAtPosition(replacementChain, blockPos);
        if (block) {
            nextCursorPosition = { block, offset };
        }
    }

    const insertPos = removeRange(range);
    insertPos.block.insertAt(replacementChain, insertPos.offset);
    selection.anchorAt(nextCursorPosition);
}

function buildReplacementChain(source?: string | BlockChainState): IBlock {
    if (!source) {
        return null;
    }

    if (typeof source === 'string') {
        return buildChainFromCalchub(source);
    }

    if (Array.isArray(source)) {
        return BlockBuilder.fromJS(source);
    }

    return null;
}

export function getBlockAtIndex(block: IBlock, index: number): IBlock {
    let i = 0;

    while (i < index && block) {
        block = block.right;
        i++;
    }

    return block;
}

export function getTrailingPhrase(cursorPosition: ICursorPosition): string {
    const { block, offset } = cursorPosition;
    const blockToLeft = offset === 0 ? block.left : block;

    if (!blockToLeft) {
        return '';
    }

    if (!blockToLeft.node) {
        return '';
    }

    const targetNode = blockToLeft.node;

    // walk to the left until
    // the blocks node does not equal ours
    let phrase = blockToLeft.text;
    let b = blockToLeft.left;
    while (b != null && b.node === targetNode) {
        phrase += b.text;
        b = b.left;
    }

    return phrase;
}

export function getCompleteRangeForNodeAtBlock(block: IBlock) {
    if (block == null) {
        return null;
    }

    if (block.node == null) {
        return null;
    }

    const targetNode = block.node;

    // walk to the left until
    // the blocks token does not equal ours
    let start = block;
    while (start.left && start.left.node === targetNode) {
        start = start.left;
    }

    // walk to the right until
    // the blocks token does not equal ours
    let end = block;
    while (end.right && end.right.node === targetNode) {
        end = end.right;
    }

    return Range.create({ block: start, offset: 0 }, { block: end, offset: 1 });
}

export function insertFraction(cp: CursorPosition): ICursorPosition {
    const { block, offset } = cp;
    const frac = new FractionBlock();
    if (offset === 1) {
        let num = getNumeratorChain(block);
        if (num != null) {
            frac.setNum(num);
        }
        block.insertAt(frac, offset);
        if (num != null && num.type != BlockType.Blank) {
            let deletion = getNumeratorRange(frac.left);
            removeRange(deletion);
        }
    } else if (offset === 0 && block.left != null) {
        let num = getNumeratorChain(block.left);
        if (num != null) {
            frac.setNum(num);
        }
        block.insertAt(frac, offset);
        if (num != null && num.type != BlockType.Blank) {
            let deletion = getNumeratorRange(frac.left);
            removeRange(deletion);
        }
    } else {
        block.insertAt(frac, offset);
    }

    return nextCursorPositionFraction(frac);
}

export function insertFractionWithSelection(selection: Selection): ICursorPosition {
    const frac = new FractionBlock();

    let currentBlock = selection.start.block;
    let chain = currentBlock.clone();

    while (currentBlock != selection.end.block) {
        currentBlock = currentBlock.right;
        chain.chainEnd.insertChainRight(currentBlock.clone());
    }

    frac.setNum(chain);
    selection.start.block.insertChainLeft(frac);

    return nextCursorPositionFraction(frac);
}

function nextCursorPositionFraction(block: FractionBlock): ICursorPosition {
    if (block.num.type === BlockType.Blank) {
        return { block: block.num, offset: 0 };
    }
    if (block.denom.type === BlockType.Blank) {
        return { block: block.denom, offset: 0 };
    }
    return { block: block, offset: 1 };
}

function getNumeratorRange(block: IBlock): Range {
    let deletion = new Range();

    if (block == null || block.type === BlockType.Blank) return deletion;
    
    deletion.setAnchor({ block: block, offset: 1 });

    if (block.type === BlockType.RightParens) {
        let leftParens = (block as RightParensBlock).leftParensPartner;
        if (leftParens != null) {
            deletion.setFocus({ block: leftParens, offset: 0 });
        }
        return deletion;
    } else if (block.type === BlockType.Block || block.type === BlockType.SupSub) {
        let currentBlock = block;
        while (currentBlock.left != null && (currentBlock.left.type === BlockType.SupSub || !isBinaryOpFam(currentBlock.left.node))) {
            currentBlock = currentBlock.left;
        }
        deletion.setFocus({ block: currentBlock, offset: 0 });
        return deletion;
    } else if (block.type === BlockType.Function || block.type === BlockType.Radical || block.type === BlockType.Fraction) {
        deletion.setFocus({ block: block, offset: 0 });
        return deletion;
    }
    return null;
}

function getNumeratorChain(block: IBlock): IBlock {
    if (block == null) return null;

    let chain = null;
    if (block.type === BlockType.RightParens) {
        let currentBlock = (block as RightParensBlock).leftParensPartner as IBlock;
        if (currentBlock != null) {
            chain = currentBlock.clone();
            currentBlock = currentBlock.right;
            while (currentBlock != null && currentBlock != block) {
                chain.chainEnd.insertChainRight(currentBlock.clone());
                currentBlock = currentBlock.right;
            }
            chain.chainEnd.insertChainRight(currentBlock.clone());
        }
        return chain;
    } else if (block.type === BlockType.Block) {
        if (!isBinaryOpFam(block.node)) {
            chain = block.clone();
            let currentBlock = block.left;
            while (currentBlock != null && !isBinaryOpFam(currentBlock.node)) {
                chain.chainStart.insertChainLeft(currentBlock.clone());

                currentBlock = currentBlock.left;
            }
            return chain.chainStart;
        }
    } else if (block.type === BlockType.SupSub) {
        chain = block.clone();
        let currentBlock = block.left;
        while (currentBlock != null && !isBinaryOpFam(currentBlock.node)) {
            chain.chainStart.insertChainLeft(currentBlock.clone());

            currentBlock = currentBlock.left;
        }
        return chain.chainStart;
    } else if (block.type === BlockType.Function || block.type === BlockType.Radical || block.type === BlockType.Fraction) {
        return block.clone();
    }
    return chain;
}

export function getBlockLeftOfCursorPosition(pos: ICursorPosition) {
    if (pos.offset === 1) {
        return pos.block;
    }
    return pos.block.left;
}

export function getRangeLeftOfBlockInclusive(block: IBlock): Range {
    if (block == null || block.type !== BlockType.Block) {
        return null;
    }

    const range = new Range();
    range.setAnchor({ block: block, offset: 1 });
    range.setFocus({ block: block, offset: 0 });

    while (range.focus.block.left && range.anchor.block.node === range.focus.block.left.node) {
        range.setFocus({ block: range.focus.block.left, offset: 0 })
    }

    return range;
}

export function isParensPair(value1: string, value2: string): boolean {
    const pair = parensPairs[value1];
    return pair != null && value2 === pair;
}

const parensPairs = {
    '(': ')',
    ')': '(',
    '{': '}',
    '}': '{',
    '[': ']',
    ']': '['
};

export function calchubFromState(state: IBlockState | BlockChainState): string {
    const chain = BlockBuilder.fromJS(state);
    return calchubFromChain(chain);
}

export function mergeAdjacentSupSubs(chain: IBlock): IBlock {
    if (chain == null) {
        return null;
    }

    const block = chain;
    let next = chain.right;

    if (isSupSubBlock(block) && isSupSubBlock(next)) {
        const orientation = (block.sup ? 1 : 0) + (block.sub ? 2 : 0) + (next.sup ? 4 : 0) + (next.sub ? 8 : 0);

        switch (orientation) {

            // block is empty
            case 0:
            case 4:
                // remove block and move on
                block.remove();
                break;

            // right is empty
            case 1:
            case 2:
            case 3:
                // move on
                break;

            // both have a sup
            case 5:
                break;

            // block has sub, right has sup: merge!
            case 6:
                block.setSup(next.sup);
                next.remove();
                next = block.right;
                break;

            // block is full
            case 7:
            case 11:
                break;

            // block is empty
            case 8:
            case 12:
                block.remove();
                break;

            case 9: // block has sup, right has sub
                // merge!
                block.setSub(next.sub);
                next.remove();
                next = block.right;
                break;

            case 10: // both have subs
                break;

            // right is full
            case 13:
            case 14:
            case 15:
                break;
        }
    }

    if (next != null) {
        return mergeAdjacentSupSubs(next);
    } else {
        return block.chainStart;
    }
}

export function getFirstMatrixBlockParent(block: IBlock): MatrixBlock {
    if (!block) {
        return null;
    }
    return isMatrixBlock(block) ? block : getFirstMatrixBlockParent(block.parent);
}
