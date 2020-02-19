import { isSymbolFam, Parens } from 'math';
import { action } from 'mobx';
import {
    Action,
    BaseHandler,
    BlankBlock,
    Block,
    BlockType,
    BlockUtils,
    ChainBuilder,
    DifferentialBlock,
    Dir,
    isDerivativeBlock,
    isRightParensBlock,
    isSupSubBlock,
    LeftParensBlock,
    MathEngine,
    RightParensBlock,
    SupSubBlock,
    ViewState,
} from 'pretty-math/internal';
import { getBlockLeftOfCursorPosition, getRangeLeftOfBlockInclusive } from '../utils/BlockUtils';

export class MathHandler extends BaseHandler {
    engine: MathEngine;

    constructor(engine: MathEngine) {
        super(engine);
    }

    @action
    insertText(text: string) {
        const { selection } = this;

        if (!selection.isCollapsed) {
            if (text === '/') {
                const cp = BlockUtils.insertFractionWithSelection(selection);
                this.backspace();
                selection.anchorAt(cp);
                this._lastAction = Action.Insert;
                return;
            } else {
                this.backspace();
            }
        }

        const { block, offset } = this.selection.focus;

        // a couple of special cases
        switch (text) {

            case '\\':
                this.engine.assistant.forceOpen();
                this.engine.assistant.library.setViewState(ViewState.FullLibrary);
                return;

            case '/':
                return this.insertFraction();

            case '^':
                return this.insertSup();

            case '_':
                return this.insertSub();

            case ' ':
                return this.insertSpace();

        }

        if (Parens.isAnyParens(text)) {
            return this.insertParens(text);
        }

        const parent = block.parent;
        if (text === 'd' && parent && isDerivativeBlock(parent) && block.chainStart === parent.wrt) {
            return this.insertDifferential();
        }

        const blockChain = ChainBuilder.buildChainFromMath(text);
        let nextPosition = { block: blockChain.chainEnd, offset: 1 };
        block.insertAt(blockChain, offset);
        this.selection.anchorAt(nextPosition);
        this._lastAction = Action.Insert;
    }

    @action
    private insertSpace() {
        const { block, offset } = this.selection.focus;
        const spaceBlock = new Block(' ');
        const nextPosition = block.insertAt(spaceBlock, offset);
        this.selection.anchorAt(nextPosition);
        this._lastAction = Action.Insert;
    }

    @action
    private insertDifferential() {
        const { block, offset } = this.selection.focus;
        const diffBlock = new DifferentialBlock();
        block.insertAt(diffBlock, offset);
        const nextPosition = { block: diffBlock.inner, offset: 0 };
        this.selection.anchorAt(nextPosition);
        this._lastAction = Action.Insert;
    }

    @action
    private insertFraction() {
        const { focus } = this.selection;
        const nextPosition = BlockUtils.insertFraction(focus);
        this.selection.anchorAt(nextPosition);
        this._lastAction = Action.Insert;
    }

    @action
    private insertParens(parens: string) {
        let nextPosition = null;

        if (Parens.isAnyLeftParens(parens)) {
            // insert a left and right parens
            const leftBlock = getBlockLeftOfCursorPosition(this.selection.focus);
            const leftRange = getRangeLeftOfBlockInclusive(leftBlock);
            if (leftRange) {
                const libEntry = this.engine.library.libraryEntryWithExactKeyword(leftRange.toText());
                
                if (libEntry) {
                    BlockUtils.replaceRangeWithLibraryEntry(this.selection, leftRange, libEntry);
                    return;
                }
            }
            const lp = new LeftParensBlock(parens, (Parens.isLeftCurlyParens(parens) ? '\\{' : null));
            const { block, offset } = this.selection.focus;
            nextPosition = block.insertAt(lp, offset);

            if (lp.isChainEnd) {
                const rp = new RightParensBlock(Parens.getParensPair(parens), (Parens.isLeftCurlyParens(parens) ? '\\}' : null));
                lp.insertChainRight(rp);
            }
        }

        if (Parens.isAnyRightParens(parens)) {
            // just insert a right parens
            const { block, offset } = this.selection.focus;
            const blockToRight = offset === 0 ? block : block.right;
            if (!isRightParensBlock(blockToRight)) {
                const rp = new RightParensBlock(parens, (Parens.isRightCurlyParens(parens) ? '\\}' : null));
                nextPosition = block.insertAt(rp, offset);
            } else {
                nextPosition = { block: blockToRight, offset: 1 };
            }
        }

        this.selection.anchorAt(nextPosition);
        this._lastAction = Action.Insert;
    }

    @action
    private insertSup() {
        const focusBlock = this.selection.focus.block;
        const focusOffset = this.selection.focus.offset;

        const blockToLeft = focusOffset === 0 ? focusBlock.left : focusBlock;
        const blockToRight = focusOffset === 0 ? focusBlock : focusBlock.right;

        if (focusBlock.type === BlockType.Blank) {
            return;
        }

        if (isSupSubBlock(blockToLeft)) {
            let nextPosition = blockToLeft.getNextCursorPositionAddSuperscript(Dir.Left);
            this.selection.anchorAt(nextPosition);
            this._lastAction = Action.Insert;
            return;
        }

        if (isSupSubBlock(blockToRight)) {
            let nextPosition = blockToRight.getNextCursorPositionAddSuperscript(Dir.Right);
            this.selection.anchorAt(nextPosition);
            this._lastAction = Action.Insert;
            return;
        }
        
        if (blockToLeft) {
            const newSupSub = new SupSubBlock(new BlankBlock());
            focusBlock.insertAt(newSupSub, focusOffset);
            let nextPosition = { block: newSupSub.sup, offset: 0 };
            this.selection.anchorAt(nextPosition);
            this._lastAction = Action.Insert;
            return;
        }
    }

    @action
    private insertSub() {
        const focusBlock = this.selection.focus.block;
        const focusOffset = this.selection.focus.offset;

        const blockToLeft = focusOffset === 0 ? focusBlock.left : focusBlock;
        const blockToRight = focusOffset === 0 ? focusBlock : focusBlock.right;

        if (focusBlock.type === BlockType.Blank) {
            return;
        }

        if (isSupSubBlock(blockToLeft)) {
            let nextPosition = blockToLeft.getNextCursorPositionAddSubscript(Dir.Left);
            this.selection.anchorAt(nextPosition);
            this._lastAction = Action.Insert;
            return;
        }

        if (isSupSubBlock(blockToRight)) {
            let nextPosition = blockToRight.getNextCursorPositionAddSubscript(Dir.Right);
            this.selection.anchorAt(nextPosition);
            this._lastAction = Action.Insert;
            return;
        }

        if (
            blockToLeft
            && blockToLeft.decor
            && isSymbolFam(blockToLeft.node)
        ) {
            const blankBlock = new BlankBlock();
            const newSupSub = new SupSubBlock(null, blankBlock);
            focusBlock.insertAt(newSupSub, focusOffset);
            const nextPosition = { block: blankBlock, offset: 0 };
            this.selection.anchorAt(nextPosition);
            this._lastAction = Action.Insert;
        } else {
            alert('Only variables can have subscripts.');
        }
    }

    @action
    pasteData(data: string) {
        this.insertText(data);
    }

    @action
    tab(e: React.KeyboardEvent) {
        const { selection } = this;
        const { focus } = selection;
        const matrix = BlockUtils.getFirstMatrixBlockParent(focus.block);

        if (matrix && selection.isCollapsed) {
            if (e.shiftKey) {
                // move selection to the start of the cell
                // then imitate the user hitting the left arrow
                selection.anchorAt({ block: focus.block.chainStart, offset: 0 });
                this.left();
                return;
            }

            selection.anchorAt({ block: focus.block.chainEnd, offset: 1 });
            this.right();
        }
    }
}
