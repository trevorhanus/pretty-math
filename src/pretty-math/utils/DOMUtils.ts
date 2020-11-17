export interface OffsetDims {
    offsetLeft: number;
    offsetTop: number;
}

export function offsetFromAncestor(ancestor: HTMLElement, target: HTMLElement): OffsetDims {
    let dims: OffsetDims = {
        offsetLeft: 0,
        offsetTop: 0,
    };

    if (!ancestor || !target) {
        return dims;
    }

    if (!ancestor.contains(target)) {
        return dims;
    }

    while (target && target !== ancestor) {
        dims = addOffsets(dims, target);
        target = target.offsetParent as HTMLElement;
    }

    return dims;
}

function addOffsets(dims: OffsetDims, target: HTMLElement): OffsetDims {
    return {
        offsetLeft: dims.offsetLeft + target.offsetLeft,
        offsetTop: dims.offsetTop + target.offsetTop,
    }
}
