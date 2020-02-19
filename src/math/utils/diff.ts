import isEqual from 'lodash.isequal';
import isEmpty from 'lodash.isempty';

export interface IDiffResult<T> {
    diff1: T,
    diff2: T,
    isDifferent: boolean;
}

export function diff<T>(s1: T, s2: T): IDiffResult<T> {
    if (isPrimitive(s1)) {
        return diffPrimitive(s1, s2);
    } else {
        return diffObj(s1, s2);
    }
}

function isPrimitive(val: any): boolean {
    return val == null || typeof val === 'boolean' || typeof val === 'string' || typeof val === 'number';
}

export function diffPrimitive<T>(val1: T, val2: T): IDiffResult<T> {
    if (!isEqual(val1, val2)) {
        return {
            diff1: val1 == null ? null : val1,
            diff2: val2 == null ? null : val2,
            isDifferent: true,
        }
    } else {
        return {
            diff1: undefined,
            diff2: undefined,
            isDifferent: false,
        }
    }
}

export function diffObj<T>(source1: T, source2: T): IDiffResult<T> {
    if (source1 === undefined && source2 === undefined) {
        return {
            diff1: undefined,
            diff2: undefined,
            isDifferent: false,
        }
    }

    if (source1 == null) {
        return {
            diff1: null,
            diff2: source2,
            isDifferent: true,
        }
    }

    if (source2 == null) {
        return {
            diff1: source1,
            diff2: null,
            isDifferent: true,
        }
    }

    const seen: { [key: string]: boolean } = {};
    const diff1 = {} as T;
    const diff2 = {} as T;

    for (let prop in source1) {
        const v1 = source1[prop];
        const v2 = source2[prop];

        const diffResult = diff(v1, v2);

        if (diffResult.isDifferent) {
            diff1[prop] = diffResult.diff1;
            diff2[prop] = diffResult.diff2;
        }

        seen[prop] = true;
    }

    for (let prop in source2) {
        if (seen[prop]) {
            continue;
        }

        const v1 = source1[prop];
        const v2 = source2[prop];

        const diffResult = diff(v1, v2);

        if (diffResult.isDifferent) {
            diff1[prop] = diffResult.diff1;
            diff2[prop] = diffResult.diff2;
        }
    }

    return {
        diff1: diff1,
        diff2: diff2,
        isDifferent: !isEmpty(diff1),
    };
}
