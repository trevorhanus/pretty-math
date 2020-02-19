import { INode, MathExpr } from '../internal';

export interface IMergeConflict {
    message: string;
    duplicateVar: MathExpr;
}

export interface IDataTable {
    tableName: string;
    getCell(loc: string): IDataTableCell;
    setCell(loc: string, expr: string): void;
    toJS(): IDataTableProps;
}

export interface IDataTableCell {
    loc: string;
    expr: string;
    eval: INode;
    isMath: boolean;
    isString: boolean;
    setExpr(expr: string): void;
}

export interface IError {
    type: ErrorType;
    message: string;
    displayValue: string;
}

export enum ErrorType {
    Generic = '#ERR!',
    CircularReference = '#CIR!',
    ReferenceValueError = '#REF!',
    ReferenceNotFound = '#REF?',
    InvalidSymbol = '#SYM',
    InvalidExpresssion = '#MATH',
    DuplicateVariable = '#DUP!',
}

// Serial interfaces
// _________________________________

export interface MathContextProps {
    dataTables?: IDataTableProps[];
    exprs?: MathExprProps[];
}

export interface MathExprProps {
    id?: string;
    expr?: string;
    color?: string;
    description?: string;
    units?: string;
}

export interface IDataTableProps {
    tableName?: string;
    cells?: {
        [cellLoc: string]: ICellProps;
    }
}

export interface ICellProps {
    expr?: string;
}
