import { action, computed } from 'mobx';
import { Dir } from '../interfaces';
import { Block } from '../model';
import { EditorState } from '../model/EditorState';
import { CursorPosition } from './CursorPosition';
import { SelectionRange } from './SelectionRange';

export class Selection {
    readonly editorState: EditorState;
    private range: SelectionRange;

    constructor(editorState: EditorState) {
        this.editorState = editorState;
        this.range = new SelectionRange();
        this.anchorAtStart();
    }

    @computed
    get anchor(): CursorPosition {
        return this.range.anchor || CursorPosition.blank();
    }

    @computed
    get focus(): CursorPosition {
        return this.range.focus || CursorPosition.blank();
    }

    // @computed
    // get focusedNode(): INode {
    //     if (this.focus == null || this.focus.block == null) {
    //         return null;
    //     }
    //
    //     const focusedBlock = this.focus.block;
    //     return focusedBlock && focusedBlock.node;
    // }

    // @computed
    // get focusedTokenRange(): Range {
    //     return BlockUtils.getCompleteRangeForNodeAtBlock(this.focus.block);
    // }

    // @computed
    // get focusedNodeTokenValue(): string {
    //     return this.focusedNode != null ? this.focusedNode.tokenValue : '';
    // }

    @computed
    get isCollapsed(): boolean {
        return this.anchor.isEqualTo(this.focus);
    }

    @computed
    get isEmpty(): boolean {
        return this.anchor.isBlank;
    }

    @computed
    get selectedRange(): SelectionRange {
        return SelectionRange.create(this.start, this.end);
    }

    @computed
    get start(): CursorPosition {
        if (this.isEmpty) {
            return CursorPosition.blank();
        }

        return this.range.start;
    }

    @computed
    get trailingPhrase(): string {
        return '';
    }

    @computed
    get end(): CursorPosition {
        if (this.isEmpty) {
            return CursorPosition.blank();
        }

        return this.range.end;
    }

    hasFocus(block: Block): boolean {
        return this.focus != null && this.focus.block != null && this.focus.block === block;
    }

    includes(range: SelectionRange): boolean {
        return this.range.includes(range);
    }

    includesBlock(block: Block): boolean {
        const anchor = new CursorPosition(block, 0);
        const focus = new CursorPosition(block, 1);
        const range = SelectionRange.create(anchor, focus);
        return this.includes(range);
    }

    // isPartOfFocusedNode(block: Block): boolean {
    //     return block.node === this.focusedNode;
    // }

    @action
    anchorAt(position: CursorPosition) {
        if (position == null) return;

        if (this.editorState.root.contains(position.block)) {
            this.range.setAnchor(position);
            return;
        }
        console.warn("Attempted to set cursor position at a block that isn't in the chain. Set cursor position to start.");
        this.anchorAtStart();
    }

    @action
    anchorAtEnd() {
        const pos = new CursorPosition(this.editorState.content.end, 1);
        this.anchorAt(pos);
    }

    @action
    anchorAtStart() {
        const pos = new CursorPosition(this.editorState.content.start, 0);
        this.anchorAt(pos);
    }

    // @action
    // applyState(state: ISelectionState) {
    //     if (state == null) {
    //         return;
    //     }
    //
    //     const { start, end } = state;
    //     const startBlock = this._engine.root.getBlockById(start.blockId);
    //     const endBlock = this._engine.root.getBlockById(end.blockId);
    //
    //     if (!startBlock) {
    //         console.log('could not find start block');
    //         return;
    //     }
    //
    //     if (!endBlock) {
    //         console.log('could not find end block');
    //         return;
    //     }
    //
    //     const startPos = { block: startBlock, offset: start.offset };
    //     const endPos = { block: endBlock, offset: end.offset };
    //
    //     this.anchorAt(startPos);
    //     this.focusTo(endPos);
    // }

    @action
    clear() {
        this.range.clear();
    }

    @action
    collapse(dir: Dir) {
        if (this.isCollapsed) {
            return;
        }

        switch (dir) {

            case Dir.Down:
            case Dir.Right:
                this.anchorAt(this.end);
                break;

            case Dir.Up:
            case Dir.Left:
                this.anchorAt(this.start);
                break;

            default:
                return;
        }
    }

    @action
    focusTo(position: CursorPosition) {
        this.range.setFocus(position);
    }

    // toJS(): ISelectionState {
    //     if (this.isEmpty) {
    //         return null;
    //     }
    //
    //     return {
    //         start: {
    //             blockId: this.start.block.id,
    //             offset: this.start.offset,
    //         },
    //         end: {
    //             blockId: this.end.block.id,
    //             offset: this.end.offset,
    //         }
    //     };
    // }

    // for testing purposes
    toSummary(): any {
        return {
            startBlock: this.start.block,
            startOffset: this.start.offset,
            endBlock: this.end.block,
            endOffset: this.end.offset,
            anchorBlock: this.anchor.block,
            anchorOffset: this.anchor.offset,
            focusBlock: this.focus.block,
            focusOffset: this.focus.offset,
        }
    }
}
