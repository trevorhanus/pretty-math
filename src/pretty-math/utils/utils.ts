import { IBlock } from 'pretty-math/internal';
import { Output } from 'pretty-math/utils';
import { between } from 'common'

export function invariant(check: boolean, message: string) {
    if (check) {
        throw new Error(`[pretty-math2] ${message}`);
    }
}

export function warn(message: string) {
    console.warn(`[pretty-math2] ${message}`);
}

// returns
// 0 for left
// 1 for right
// -1 for out of bounds
export function getTargetedSide(e: MouseEvent | React.MouseEvent, target: HTMLElement): number {
    const localOffset = e.clientX - target.getBoundingClientRect().left;
    const width = target.offsetWidth;

    if (localOffset < 0 || localOffset > width) {
        // out of bounds
        return -1;
    }

    return Math.round(localOffset / width);
}

export function replaceAt(target: string, index: number, replacement: string) {
    const chars = target.split('');
    chars.splice(index, 1, replacement);
    return chars.join('');
}

export function splitAt(target: string, index: number): [string, string] {
    return [target.slice(0, index), target.slice(index)];
}

export function normalizeOffset(offset: number): number {
    return offset === -1 ? 1 : between(0, 1, offset);
}

export function getOffsetLeftFromAncestor(ancestor: HTMLElement, child: HTMLElement): number {
    if (!ancestor.contains(child)) {
        return null;
    }

    const ancestorBBox = ancestor.getBoundingClientRect();
    const childBBox = child.getBoundingClientRect();

    return childBBox.left - ancestorBBox.left;
}

export interface BBox {
    top: number;
    right: number;
    bottom: number;
    left: number;
    width: number;
    height: number;
}

export function getRelativeBoundingBox(anchor: HTMLElement, target: HTMLElement): BBox {
    const anchorRect = anchor.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const top = targetRect.top - anchorRect.top;
    const left = targetRect.left - anchorRect.left;

    return {
        top,
        left,
        right: left + targetRect.width,
        bottom: top + targetRect.height,
        width: targetRect.width,
        height: targetRect.height,
    };
}

export function exhausted(check: never): never {
    throw new Error('Enum not exhausted.');
}

export function calchubFromChain(chain: IBlock): string {
    const output = calchubOutputFromChain(chain);
    return (output && output.text) || '';
}

export function calchubOutputFromChain(chain: IBlock): Output {
    if (!chain) {
        return Output.blank();
    }

    return Output.fromMany([
        chain.toCalchubOutput(),
        calchubOutputFromChain(chain.right),
    ]);
}
