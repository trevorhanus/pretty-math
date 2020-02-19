import { diff, isEmpty, MathContextProps } from '../internal';

export type ChangeSet = Change[];

export interface Change {
    type: ChangeType;
    id: string;
    newProps?: any;
    oldProps?: any;
}

export enum ChangeType {
    ExprInsert = 'expr_i',
    ExprUpdate = 'expr_u',
    ExprDelete = 'expr_d',
    DataTableInsert = 'dt_i',
    DataTableUpdate = 'dt_u',
    DataTableDelete = 'dt_d',
    NoChange = 'none',
}

export function buildChangeSet(oldMathCxtProps: MathContextProps, newMathCxtProps: MathContextProps): ChangeSet {
    const { dataTables: oldDataTables, exprs: oldExprs } = oldMathCxtProps;
    const { dataTables: newDataTables, exprs: newExprs } = newMathCxtProps;

    const changeSet: ChangeSet = [];

    const workingMap: { [id: string]: Change } = {};

    // each of the dataTables in the newDataTables list is a potential insert
    newDataTables.forEach(newDTProps => {
        workingMap[newDTProps.tableName] = {
            type: ChangeType.DataTableInsert,
            id: newDTProps.tableName,
            newProps: newDTProps,
        };
    });

    // now we'll go through the oldDataTables
    // if we find it in our working map, it's an update
    // if we don't, it's a delete
    oldDataTables.forEach(oldDTProps => {
        const id = oldDTProps.tableName;
        if (workingMap[id]) {
            // then was there a change?
            const newProps = workingMap[id].newProps;
            const { diff1, diff2 } = diff(newProps, oldDTProps);
            if (!isEmpty(diff1)) {
                // was an update
                workingMap[id] = {
                    type: ChangeType.DataTableUpdate,
                    id,
                    newProps: diff1,
                    oldProps: diff2,
                };
            } else {
                workingMap[id].type = ChangeType.NoChange;
            }
        } else {
            // its a delete
            workingMap[id] = {
                type: ChangeType.DataTableDelete,
                id,
                oldProps: oldDTProps,
            };
        }
    });

    // now we need to do the same thing for the exprs

    newExprs.forEach(newExprProps => {
        workingMap[newExprProps.id] = {
            type: ChangeType.ExprInsert,
            id: newExprProps.id,
            newProps: newExprProps,
        };
    });

    oldExprs.forEach(oldExprProps => {
        const id = oldExprProps.id;
        if (workingMap[id]) {
            const newProps = workingMap[id].newProps;
            const { diff1, diff2 } = diff(newProps, oldExprProps);
            if (!isEmpty(diff1)) {
                workingMap[id] = {
                    type: ChangeType.ExprUpdate,
                    id,
                    newProps: diff1,
                    oldProps: diff2,
                };
            } else {
                workingMap[id].type = ChangeType.NoChange;
            }
        } else {
            workingMap[id] = {
                type: ChangeType.ExprDelete,
                id,
                oldProps: oldExprProps,
            };
        }
    });

    for (let id in workingMap) {
        const change = workingMap[id];
        if (change.type !== ChangeType.NoChange) {
            changeSet.push(change);
        }
    }

    return changeSet;
}
