import { IBlock, isCompositeBlock } from 'pretty-math/internal';
import { getBlockAtIndex } from 'pretty-math/utils/BlockUtils';

export interface PathStop {
    index: number;
    childNumber?: number;
}

export class BlockPosition {
    readonly path: PathStop[];
    readonly index: number;

    constructor(path: PathStop[], index: number) {
        this.path = (path && [...path]) || [];
        this.index = index;
    }

    get depth(): number {
        return this.path.length;
    }

    equals(pos: BlockPosition): boolean {
        return this.path.length === pos.path.length
            && this.index === pos.index
            && this.path.every((stop, i) => isEqual(stop, pos.stopAt(i)));
    }

    incIndex(): BlockPosition {
        return new BlockPosition(this.path, this.index + 1);
    }

    incLevel(childNumber: number): BlockPosition {
        const pathStop = {
            index: this.index,
            childNumber,
        };

        const path = [...this.path, pathStop];
        return new BlockPosition(path, 0);
    }

    isBelow(pos: BlockPosition): boolean {
        if (this.depth <= pos.depth) {
            return false;
        }

        return this.toString().startsWith(pos.toString());
    }

    isLeftOf(pos: BlockPosition): boolean {
        let l = 0;
        let us = this.stopAt(l);
        let them = pos.stopAt(l);
        while (us && them) {
            if (isLeftOf(us, them)) {
                return true;
            }

            if (isRightOf(us, them)) {
                return false;
            }

            // else it's the same stop
            l++;
            us = this.stopAt(l);
            them = pos.stopAt(l);
        }

        // every stop was the same, so the higher
        // pos is a parent
        return false;
    }

    isRightOf(pos: BlockPosition): boolean {
        let l = 0;
        let us = this.stopAt(l);
        let them = pos.stopAt(l);
        while (us && them) {
            if (isLeftOf(us, them)) {
                return false;
            }

            if (isRightOf(us, them)) {
                return true;
            }

            // else it's the same stop
            l++;
            us = this.stopAt(l);
            them = pos.stopAt(l);
        }

        // every stop was the same, so the higher
        // pos is a parent
        return false;
    }

    stopAt(level: number): PathStop {
        switch (true) {
            case level < this.path.length:
                return this.path[level];
            case level === this.path.length:
                return { index: this.index };
            default:
                return null;
        }
    }

    toString(): string {
        // should end up looking like: 0.1:1.2:3.1:4
        const stops = this.path.map(stop => {
            return `${stop.index}.${stop.childNumber}`;
        });

        stops.push(`${this.index}`);
        return stops.join(':')
    }

    // for testing
    static fromString(str: string): BlockPosition {
        const parts = str.split(':');
        const index = parseInt(parts.pop());
        const paths = parts.map(path => {
            const [ index, childNumber ] = path.split('.');

            return {
                index: parseInt(index),
                childNumber: parseInt(childNumber),
            };
        });

        return new BlockPosition(paths, index);
    }

    static root(): BlockPosition {
        return new BlockPosition([], 0);
    }
}

function isEqual(s1: PathStop, s2: PathStop): boolean {
    return s1.index === s2.index && s1.childNumber === s2.childNumber;
}

function isLeftOf(us: PathStop, them: PathStop): boolean {
    if (us.index < them.index) {
        return true;
    }

    if (us.index > them.index) {
        return false;
    }

    // index is the same
    if (us.childNumber == null || them.childNumber == null) {
        return false;
    }

    return us.childNumber < them.childNumber;
}

function isRightOf(us: PathStop, them: PathStop): boolean {
    if (us.index > them.index) {
        return true;
    }

    if (us.index < them.index) {
        return false;
    }

    // index is the same
    if (us.childNumber == null || them.childNumber == null) {
        return false;
    }

    return us.childNumber > them.childNumber;
}

export function getBlockAtPosition(blockTree: IBlock, pos: BlockPosition | string): IBlock {
    if (typeof pos === 'string') {
        pos = BlockPosition.fromString(pos);
    }

    const { path, index } = pos;

    let i = 0;
    let block = blockTree;

    while (i < path.length) {
        if (!block) {
            return null;
        }

        const pathStop = path[i];

        // 0.1 -> index: 0, childNumber: 1
        const { index, childNumber } = pathStop;
        // need to find the block in the chain at the index
        block = getBlockAtIndex(block, index);

        if (!isCompositeBlock(block)) {
            return null;
        }

        const chain = block.getChainAtChainPosition(childNumber);

        if (!chain) {
            return null;
        }

        block = chain.chainStart;
        i++;
    }

    return getBlockAtIndex(block, index);
}
