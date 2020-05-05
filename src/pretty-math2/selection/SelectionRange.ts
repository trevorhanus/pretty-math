import { Block } from 'pretty-math2/model';
import { observable, computed, action } from 'mobx';
import { invariant } from 'pretty-math2/utils/invariant';
import { getCommonParent } from '../utils/BlockUtils';
import { sortLeftToRight } from './BlockPosition';

export class SelectionRange {
    @observable _anchor: Block;
    @observable _focus: Block;

    @computed
    get anchor(): Block {
        return this._anchor;
    }

    @computed
    get end(): Block {
        let [ start, end ] = sortBlocksLeftToRight(this.focus, this.anchor);

        if (start.list === end.list) {
            return end;
        }

        const commonParent = getCommonParent(start, end);

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
        let [ start, end ] = sortBlocksLeftToRight(this.focus, this.anchor);

        if (start.list === end.list) {
            return start;
        }

        const commonParent = getCommonParent(start, end);

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

export function sortBlocksLeftToRight(b1: Block, b2: Block): [Block, Block] {
    const [ pLeft, pRight ] = sortLeftToRight(b1.position, b2.position);
    if (b1.position === pLeft) {
        return [b1, b2];
    } else {
        return [b2, b1];
    }
}
