import { action, computed } from 'mobx';
import {
    Block,
    Editor,
    BlockRange,
} from 'pretty-math/internal';

export interface SerializedSelectionState {
    anchor: string;
    focus: string;
}

export class Selection {
    private _disposeReaction: () => void;
    readonly editor: Editor;
    readonly range: BlockRange;

    constructor(editor: Editor) {
        this.editor = editor;
        this.range = new BlockRange();
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
    get trailingPhraseRange(): BlockRange {
        const anchor = this.focus;

        if (!anchor) {
            return BlockRange.empty();
        }

        const range = new BlockRange();
        range.setAnchor(anchor);

        let block = anchor.prev;
        while (block && includeInTrailingPhrase(block)) {
            range.setFocus(block);
            block = block.prev;
        }

        return range;
    }

    isBlockSelected(block: Block): boolean {
        return !this.isCollapsed &&
            (block === this.range.start ||
                (block.position.isRightOf(this.range.start.position) &&
                    block.position.isLeftOf(this.range.end.position)));
    }

    @action
    anchorAt(block: Block) {
        if (block == null) return;

        if (this.editor.root.contains(block)) {
            this.range.setAnchor(block);
            return;
        }
        console.warn("Attempted to set cursor position at a block that isn't in root. Set cursor position to start.");
        this.anchorAtStart();
    }

    @action
    anchorAtEnd() {
        this.anchorAt(this.editor.inner.end);
    }

    @action
    anchorAtStart() {
        this.anchorAt(this.editor.inner.start);
    }

    @action
    applyState(state?: SerializedSelectionState) {
        if (!state) {
            return;
        }

        const { anchor, focus } = state;
        this.anchorAt(this.editor.root.getBlockById(anchor));
        this.focusAt(this.editor.root.getBlockById(focus));
    }

    @action
    focusAt(block: Block) {
        if (block == null) return;
        if (this.editor.root.contains(block)) {
            this.range.setFocus(block);
            return;
        }
        console.warn("Attempted to set the cursor focus to a block not in the tree.");
    }

    serialize(): SerializedSelectionState {
        return {
            anchor: this.range.anchor ? this.range.anchor.id : null,
            focus: this.range.focus ? this.range.focus.id : null,
        };
    }
}

const TRAILING_PHRASE_PART = /^[a-zA-Z]$/;
function includeInTrailingPhrase(block: Block): boolean {
    if (!block) {
        return false;
    }

    const { type, data } = block;
    return type === 'atomic' && data.text && TRAILING_PHRASE_PART.test(data.text);
}
