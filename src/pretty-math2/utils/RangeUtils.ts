import { action } from 'mobx';
import { Block, SelectionRange } from 'pretty-math2/internal';

export function cloneBlocksInRange(range: SelectionRange): Block[] {
    const { start, end } = range;
    const blocks = [];
    let cur = start;
    while (cur != end) {
        blocks.push(cur.deepClone());
        cur = cur.next;
    }
    return blocks;
}

export function rangeToPython(range: SelectionRange): string {
    const { start, end } = range;
    let cur = start;
    let python = ''
    while (cur != end) {
        python += cur.toPython().text;
        cur = cur.next;
    }
    return python;
}

export const removeRange = action((range: SelectionRange) => {
    const { start, end } = range;
    let cur = start;
    while (cur != end) {
        const temp = cur.next;
        cur.list.removeBlock(cur);
        cur = temp;
    }
});
