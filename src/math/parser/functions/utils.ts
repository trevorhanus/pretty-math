import { Decimal } from 'decimal.js';
import { INode, isMatrixNode, MatrixNode, SyntaxError } from '../../internal';

export function allMatrices(args: INode[]): args is MatrixNode[] {
    return args.every(a => isMatrixNode(a));
}

export function convertToDegrees(radians: Decimal): Decimal {
    const pi = Decimal.acos(-1);
    const multiplier = (new Decimal(180)).div(pi);
    return radians.mul(multiplier);
}

export function convertToRadians(degrees: Decimal): Decimal {
    const pi = Decimal.acos(-1);
    const piOver180 = pi.div(180);
    return degrees.mul(piOver180);
}

export function hasDecimal(node: INode, fnName: string): Decimal {
    if (!node.decimal || node.decimal.isNaN()) {
        throw new SyntaxError(`Invalid argument for ${fnName}.`);
    }
    return node.decimal;
}

export function posInteger(node: INode, fnName: string): Decimal {
    if (!node.decimal || node.decimal.isNaN() || !node.decimal.isInt() || !node.decimal.isPositive()) {
        throw new SyntaxError(`${fnName} must be a positive integer.`);
    }
    return node.decimal;
}

export function verifyArgs(numArgs: number, fnName: string, args: INode[]): INode[] {
    args = args || [];

    if (args.length < numArgs) {
        throw new SyntaxError(`Not enough arguments for ${fnName}.`);
    }

    if (args.length > numArgs) {
        throw new SyntaxError(`Too many arguments for ${fnName}.`);
    }

    return args;
}

export function verifyArgsBetween(lowerBound: number, upperBound: number, fnName: string, args: INode[]): INode[] {
    args = args || [];

    if (args.length < lowerBound) {
        throw new SyntaxError(`Not enough arguments for ${fnName}.`);
    }

    if (args.length > upperBound) {
        throw new SyntaxError(`Too many arguments for ${fnName}.`);
    }

    return args;
}
