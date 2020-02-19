import { ChangeSet, MathExprProps } from '../internal';

export enum EventType {
    Change = 'change',
    DefineVar = 'define_var',
    DeleteVar = 'delete_var',
    DefineFn = 'define_fn',
    DeleteFn = 'delete_fn',
}

export interface ChangeEvent {
    type: EventType.Change;
    changeSet: ChangeSet;
}

export interface DefineFnEvent {
    type: EventType.DefineFn,
    exprId: string;
    funcName: string;
    props: MathExprProps;
}

export interface DefineVarEvent {
    type: EventType.DefineVar,
    exprId: string;
    symbol: string;
    props: MathExprProps;
}

export interface DeleteFnEvent {
    type: EventType.DeleteFn,
    exprId: string;
    funcName: string;
    props?: MathExprProps;
}

export interface DeleteVarEvent {
    type: EventType.DeleteVar,
    exprId: string;
    symbol: string;
    props?: MathExprProps;
}
