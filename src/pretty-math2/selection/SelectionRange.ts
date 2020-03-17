import { action, computed, observable } from 'mobx';
import { Block } from '../model';
import { CursorPosition } from './CursorPosition';

export class SelectionRange {
    @observable.ref private _anchor: CursorPosition;
    @observable.ref private _focus: CursorPosition;

    constructor() {
    }

    @computed
    get anchor(): CursorPosition {
        return this._anchor;
    }

    @computed
    get blocks(): Block[] {
        const start = this.start.block;
        const blocks: Block[] = [start];

        if (start === this.end.block) {
            return blocks;
        }

        // else we'll traverse till we find the end
        let block = start.next;
        while (block) {
            blocks.push(block);

            if (block === this.end.block) {
                break;
            }

            block = block.next;
        }

        return blocks;
    }

    @computed
    get focus(): CursorPosition {
        return this._focus;
    }

    @computed
    get isCollapsed(): boolean {
        return this.anchor && this.focus && this.anchor.isEqualTo(this.focus);
    }

    @computed
    get isEmpty(): boolean {
        return this._anchor == null || this._focus == null;
    }

    @computed
    get start(): CursorPosition {
        if (!this.anchor || !this.focus) {
            return CursorPosition.blank();
        }

        return this.anchor.isLeftOf(this.focus) ? this.anchor : this.focus;
    }

    @computed
    get end(): CursorPosition {
        if (!this.anchor || !this.focus) {
            return null;
        }

        return this.anchor.isLeftOf(this.focus) ? this.focus : this.anchor;
    }

    includes(range: SelectionRange): boolean {
        if (this.isEmpty) {
            return false;
        }

        return this.start.isLeftOfOrEqualTo(range.start) && this.end.isRightOfOrEqualTo(range.end);
    }

    @action
    clear() {
        this._anchor = null;
        this._focus = null;
    }

    @action
    setAnchor(position: CursorPosition) {
        if (position == null) {
            return;
        }

        const { block, offset } = position;
        if (block == null || offset == null) {
            return;
        }

        this._anchor = new CursorPosition(block, offset);
        this._focus = new CursorPosition(block, offset);
    }

    @action
    setFocus(position: CursorPosition) {
        if (position == null) {
            return;
        }

        const { block, offset } = position;
        if (block == null || offset == null) {
            return;
        }

        if (!this._anchor) {
            return this.setAnchor(position);
        }

        const anchorBlock = this.anchor.block;
        if (!anchorBlock.editor.root.contains(block)) {
            // block isn't in the current chain
            return;
        }

        this._focus = new CursorPosition(block, offset);
    }

    // toJS(): any {
    //     return {
    //         start: {
    //             block: this.start.block.text,
    //             offset: this.start.offset,
    //         },
    //         end: {
    //             block: this.end.block.text,
    //             offset: this.end.offset,
    //         }
    //     }
    // }

    static create(anchor?: CursorPosition, focus?: CursorPosition): SelectionRange {
        const r = new SelectionRange();
        r.setAnchor(anchor);
        r.setFocus(focus);
        return r;
    }
}
