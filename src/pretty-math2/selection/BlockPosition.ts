import { invariant } from '../utils/invariant';

/**
 * A block position is just an array of numbers
 * with the pattern [listNo, index, listNo, index, ...]
 *
 * We can also represent a block position as a string
 * that looks like this
 *
 * root:listNo.index:listNo.index
 */

export class BlockPosition {
    readonly path: number[];

    constructor(path: number[]) {
        this.path = path;
    }

    get depth(): number {
        return Math.ceil(this.path.length / 2);
    }

    get isRoot(): boolean {
        return this.path.length === 0;
    }

    get index(): number {
        if (this.path.length === 0) {
            return null;
        }
        // if the length is odd, no index
        const isEven = this.path.length % 2 === 0;
        return isEven ? this.path[this.path.length - 1] : null;
    }

    get childNumber(): number {
        if (this.path.length === 0) {
            return null;
        }
        const isOdd = this.path.length % 2 === 1;
        return isOdd ? this.path[this.path.length - 1] : this.path[this.path.length - 2];
    }

    equals(pos: BlockPosition): boolean {
        return this.path.length === pos.path.length && this.path.every((num, i) => num === pos.path[i]);
    }

    incLevel(listNumber: number): BlockPosition {
        return new BlockPosition([...this.path, listNumber]);
    }

    forIndex(index: number): BlockPosition {
        invariant(this.path.length % 2 === 0, `cannot create a new BlockPosition for an index from ${this.toString()}`);
        return new BlockPosition([...this.path, index]);
    }

    isBelow(pos: BlockPosition): boolean {
        if (this.depth < pos.depth) {
            return false;
        }

        return pos.path.every((num, i) => {
            return num === this.path[i];
        });
    }

    isLeftOf(pos: BlockPosition): boolean {
        for (let i = 0; i < this.path.length; i++) {
            const target = this.path[i];
            const comparer = pos.path[i];

            if (comparer == null) {
                // pos has the same path
                // and is higher up
                return false;
            }

            if (target === comparer) {
                continue;
            }

            return target <= comparer;
        }

        // they are exactly the same
        return false;
    }

    isLower(pos: BlockPosition): boolean {
        return this.depth > pos.depth;
    }

    isRightOf(pos: BlockPosition): boolean {
        return pos.isLeftOf(this);
    }

    toString(): string {
        let str = 'root';

        for (let i = 0; i < this.path.length; i++) {
            if (i % 2 === 0) {
                // evens are listNo
                str += `:${this.path[i]}`;
            } else {
                // odds are indices
                str += `.${this.path[i]}`;
            }
        }

        return str;
    }

    // for testing
    static fromString(str: string): BlockPosition {
        if (!str) {
            return null;
        }

        invariant(!str.startsWith('root'), `invalid BlockPosition string '${str}'`);

        const path = str.split(/[\.:]/).slice(1);
        return new BlockPosition(path.map(str => parseInt(str)));
    }

    static root(): BlockPosition {
        return new BlockPosition([]);
    }
}

export function sortLeftToRight(p1: BlockPosition, p2: BlockPosition): [BlockPosition, BlockPosition] {
    if (p1.isLeftOf(p2)) {
        return [p1, p2];
    } else {
        return [p2, p1];
    }
}

export function getCommonAncestor(p1: BlockPosition, p2: BlockPosition): BlockPosition {
    const [ higher, lower ] = sortHighestToLowest(p1, p2);

    const hPath = higher.path;
    const lPath = lower.path;

    // loop through the higher block's path until they don't match
    const commonPath = [];

    for (let i = 0; i < hPath.length; i++) {
        if (hPath[i] === lPath[i]) {
            commonPath.push(hPath[i]);
        } else {
            break;
        }
    }

    return new BlockPosition(commonPath);
}

export function sortHighestToLowest(p1: BlockPosition, p2: BlockPosition): [BlockPosition, BlockPosition] {
    if (p1.path.length < p2.path.length) {
        return [p1, p2];
    } else {
        return [p2, p1];
    }
}
