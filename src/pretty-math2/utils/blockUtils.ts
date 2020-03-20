import { Block } from 'pretty-math2/model';

export function isRootBlock(block: Block): boolean {
    return block.type === 'root' || block.type === 'root:math';
}