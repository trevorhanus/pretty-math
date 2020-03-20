import { action, computed } from 'mobx';
import { Block } from 'pretty-math2/model';
import { EditorState } from 'pretty-math2/model/EditorState';
import { SelectionRange } from './SelectionRange';

export class Selection {
    readonly editorState: EditorState;
    readonly range: SelectionRange;

    constructor(editorState: EditorState) {
        this.editorState = editorState;
        this.range = new SelectionRange();
        this.anchorAtStart();
    }

    @computed
    get anchor(): Block {
        if (!this.range.anchor) throw new Error("Anchor not set.");
        return this.range.anchor;
    }

    @computed
    get focus(): Block {
        if (!this.range.focus) throw new Error("Focus not set.");
        return this.range.focus;
    }

    @computed
    get isCollapsed(): boolean {
        return this.range.isCollapsed;
    }

    @computed
    get selectedRange(): SelectionRange {
        return this.range;
    }

    @action
    anchorAt(block: Block) {
        if (block == null) return;

        if (this.editorState.root.contains(block)) {
            this.range.setAnchor(block);
            return;
        }
        console.warn("Attempted to set cursor position at a block that isn't in the chain. Set cursor position to start.");
        this.anchorAtStart();
    }

    @action
    anchorAtEnd() {
        this.anchorAt(this.editorState.inner.end);
    }

    @action
    anchorAtStart() {
        this.anchorAt(this.editorState.inner.start);
    }

    @action
    focusAt(block: Block) {
        if (block == null) return;
        if (this.editorState.root.contains(block)) {
            this.range.setFocus(block);
            return;
        }
        console.warn("Attempted to set the cursor focus to an invalid block.");
    }

    isBlockSelected(block: Block): boolean {
        return !this.isCollapsed &&
            (block === this.range.start ||
            (block.position.isRightOf(this.range.start.position) &&
             block.position.isLeftOf(this.range.end.position)));
    }
}
