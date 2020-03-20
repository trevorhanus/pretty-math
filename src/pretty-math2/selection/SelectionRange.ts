import { Block } from 'pretty-math2/model';
import { observable, computed, action } from 'mobx';

export class SelectionRange {
    @observable _anchor: Block;
    @observable _focus: Block;

    @computed
    get anchor(): Block {
        return this._anchor;
    }

    @computed
    get blocks(): Block[] {
        if (this.isCollapsed) return [];
        const blocks: Block[] = [this.start];

        let block = this.start.next;
        while (block) {
            if (block === this.end) {
                break;
            }

            blocks.push(block);
            block = block.next;
        }

        return blocks;
    }

    @computed
    get end(): Block {
        return this.anchor.position.isRightOf(this.focus.position) ?
            this.anchor :
            this.focus;
    }

    @computed
    get focus(): Block {
        return this._focus;
    }

    @computed
    get isCollapsed(): boolean {
        return this.anchor === this.focus;
    }

    @computed
    get start(): Block {
        return this.anchor.position.isLeftOf(this.focus.position) ?
            this.anchor :
            this.focus;
    }

    @action
    setAnchor(block: Block) {
        this._anchor = block;
        this._focus = block;
    }

    @action
    setFocus(block: Block) {
        this._focus = block;
    }
}