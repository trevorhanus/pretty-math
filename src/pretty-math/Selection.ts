import { INode } from 'math';
import { action, computed } from 'mobx';
import {
    BlockUtils,
    CursorPosition,
    Dir,
    EditableEngine,
    IBlock,
    ICursorPosition,
    ISelectionState,
    Range
} from 'pretty-math/internal';

export class Selection {
    private _range: Range;
    private _engine: EditableEngine;

    constructor(engine: EditableEngine) {
        this._range = new Range();
        this._engine = engine;
    }

    @computed
    get anchor(): CursorPosition {
        return this._range.anchor || CursorPosition.blank();
    }

    @computed
    get focus(): CursorPosition {
        return this._range.focus || CursorPosition.blank();
    }

    @computed
    get focusedNode(): INode {
        if (this.focus == null || this.focus.block == null) {
            return null;
        }

        const focusedBlock = this.focus.block;
        return focusedBlock && focusedBlock.node;
    }

    @computed
    get focusedTokenRange(): Range {
        return BlockUtils.getCompleteRangeForNodeAtBlock(this.focus.block);
    }

    @computed
    get focusedNodeTokenValue(): string {
        return this.focusedNode != null ? this.focusedNode.tokenValue : '';
    }

    @computed
    get isCollapsed(): boolean {
        return this.anchor.isEqualTo(this.focus);
    }

    @computed
    get isEmpty(): boolean {
        return this.anchor.isBlank;
    }

    @computed
    get selectedRange(): Range {
        return Range.create(this.start, this.end);
    }

    @computed
    get start(): CursorPosition {
        if (this.isEmpty) {
            return CursorPosition.blank();
        }

        return this._range.start;
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

        return this._range.end;
    }

    hasFocus(block: IBlock): boolean {
        return this.focus != null && this.focus.block != null && this.focus.block === block;
    }

    includes(range: Range): boolean {
        return this._range.includes(range);
    }

    includesBlock(block: IBlock): boolean {
        const range = Range.create({ block, offset: 0 }, { block, offset: 1 });
        return this.includes(range);
    }

    isPartOfFocusedNode(block: IBlock): boolean {
        return block.node === this.focusedNode;
    }

    @action
    anchorAt(position: ICursorPosition) {
        if (position == null) return;

        if (this._engine.root.contains(position.block)) {
            this._range.setAnchor(position);
            return;
        }
        console.warn("Attempted to set cursor position at a block that isn't in the chain. Set cursor position to start.");
        this._range.setAnchor({ block: this._engine.root.chainStart, offset: 0 });
    }

    @action
    anchorAtEnd() {
        const position = { block: this._engine.root.chainEnd, offset: 1 };
        this.anchorAt(position);
    }

    @action
    anchorAtStart() {
        const position = { block: this._engine.root.chainStart, offset: 0 };
        this.anchorAt(position);
    }

    @action
    applyState(state: ISelectionState) {
        if (state == null) {
            return;
        }

        const { start, end } = state;
        const startBlock = this._engine.root.getBlockById(start.blockId);
        const endBlock = this._engine.root.getBlockById(end.blockId);

        if (!startBlock) {
            console.log('could not find start block');
            return;
        }

        if (!endBlock) {
            console.log('could not find end block');
            return;
        }

        const startPos = { block: startBlock, offset: start.offset };
        const endPos = { block: endBlock, offset: end.offset };

        this.anchorAt(startPos);
        this.focusTo(endPos);
    }

    @action
    clear() {
        this._range.clear();
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
    focusTo(position: ICursorPosition) {
        this._range.setFocus(position);
    }

    toJS(): ISelectionState {
        if (this.isEmpty) {
            return null;
        }

        return {
            start: {
                blockId: this.start.block.id,
                offset: this.start.offset,
            },
            end: {
                blockId: this.end.block.id,
                offset: this.end.offset,
            }
        };
    }

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
