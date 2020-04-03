import { Block } from 'pretty-math2/model';
import { observable, computed, action } from 'mobx';
import { invariant } from 'pretty-math2/utils/invariant';

export class SelectionRange {
    @observable _anchor: Block;
    @observable _focus: Block;

    @computed
    get anchor(): Block {
        return this._anchor;
    }

    @computed
    get end(): Block {
        let start = this.anchor.position.isLeftOf(this.focus.position) ||
                    this.focus.position.isBelow(this.anchor.position) ? this.anchor : this.focus;
        let end = this.anchor.position.isRightOf(this.focus.position) ||
                  this.anchor.position.isBelow(this.focus.position) ? this.anchor : this.focus;
        if (start.list === end.list) {
            return end;
        }
        const commonParent = start.getCommonParent(end);

        while (start.parent != commonParent) {
            start = start.parent;
            invariant(start == null, "commonParent was not found for SelectionRange.start.");
            if (start == null) {
                return null;
            }
        }
        if (end.parent != commonParent) {
            while (end.parent != commonParent) {
                end = end.parent;
                invariant(end == null, "commonParent was not found for SelectionRange.end.");
                if (end == null) {
                    return null;
                }
            }
            if (start.list != end.list) {
                return commonParent.next;
            }
            return end.next;
        }
        if (start.list != end.list) {
            return commonParent.next;
        }
        return end;
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
    get isEmpty(): boolean {
        return this._anchor == null;
    }

    @computed
    get start(): Block {
        let start = this.anchor.position.isLeftOf(this.focus.position) ||
                    this.focus.position.isBelow(this.anchor.position) ? this.anchor : this.focus;
        let end = this.anchor.position.isRightOf(this.focus.position) ||
                  this.anchor.position.isBelow(this.focus.position) ? this.anchor : this.focus;
        if (start.list === end.list) {
            return start;
        }
        const commonParent = start.getCommonParent(end);

        while (start.parent != commonParent) {
            start = start.parent;
            invariant(start == null, "commonParent was not found for SelectionRange.start.");
            if (start == null) {
                return null;
            }
        }
        while (end.parent != commonParent) {
            end = end.parent;
            invariant(end == null, "commonParent was not found for SelectionRange.end.");
            if (end == null) {
                return null;
            }
        }
        if (start.list != end.list) {
            return commonParent;
        }
        return start;
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

    static empty(): SelectionRange {
        return new SelectionRange();
    }
}

/*


    static removeRange(range: SelectionRange): Block[] {
        return this.removeRangeRecursion(range.start, range.end);
    }

    private static removeRangeRecursion(curBlock: Block, endBlock: Block): Block[] {
        let list = [];
        while (curBlock.position.isLeftOf(endBlock.position) || 
               endBlock.position.isBelow(curBlock.position)) {
            if (curBlock.type === 'end') {
                const { parent, name } = curBlock.list;
                const clone = parent.clone();
                list.forEach(curBlock => {
                    clone.children[name].insertBlock(clone.children[name].end, curBlock);
                });
                list = [clone];
                curBlock = parent.next;
                if (parent.childrenAreOnlyEndBlock || parent.childrenAreEmtpy) {
                    parent.list.removeBlock(parent);
                }
                continue;
            }
            if (endBlock.position.isBelow(curBlock.position)) {
                const clone = curBlock.clone();
                Object.keys(curBlock.config.composite.children).forEach(name => {
                    clone.children[name].setBlocks(
                        this.removeRangeRecursion(curBlock.children[name].start, endBlock)
                    );
                });
                list.push(clone);
                break;
            }
            list.push(curBlock.deepClone());
            const next = curBlock.next;
            curBlock.list.removeBlock(curBlock);
            curBlock = next;
        }
        return list;
    }


*/