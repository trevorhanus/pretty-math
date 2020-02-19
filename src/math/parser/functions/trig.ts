import { Decimal } from 'decimal.js';
import {
    convertToDegrees,
    convertToRadians,
    hasDecimal,
    INode,
    LiteralNode,
    TrigMode,
    verifyArgs
} from '../../internal';

export function acos(args: INode[], mode: TrigMode): INode {
    const [ arg ] = verifyArgs(1, 'acos', args);
    const decimal = hasDecimal(arg, 'acos');

    let val = Decimal.acos(decimal);

    if (mode === TrigMode.Degrees) {
        // need to convert to radians
        val = convertToDegrees(val);
    }

    return LiteralNode.fromDecimal(val);
}

export function acosh(args: INode[], mode: TrigMode): INode {
    const [ arg ]= verifyArgs(1, 'acosh', args);
    const decimal = hasDecimal(arg, 'acosh');

    let val = Decimal.acosh(decimal);

    if (mode === TrigMode.Degrees) {
        // need to convert to radians
        val = convertToDegrees(val);
    }

    return LiteralNode.fromDecimal(val);
}

export function asin(args: INode[], mode: TrigMode): INode {
    const [ arg ]= verifyArgs(1, 'asin', args);
    const decimal = hasDecimal(arg, 'asin');

    let val = Decimal.asin(decimal);

    if (mode === TrigMode.Degrees) {
        // need to convert to radians
        val = convertToDegrees(val);
    }

    return LiteralNode.fromDecimal(val);
}

export function asinh(args: INode[], mode: TrigMode): INode {
    const [ arg ]= verifyArgs(1, 'asinh', args);
    const decimal = hasDecimal(arg, 'asinh');

    let val = Decimal.asinh(decimal);

    if (mode === TrigMode.Degrees) {
        // need to convert to radians
        val = convertToDegrees(val);
    }

    return LiteralNode.fromDecimal(val);
}

export function atan(args: INode[], mode: TrigMode): INode {
    const [ arg ]= verifyArgs(1, 'atan', args);
    const decimal = hasDecimal(arg, 'atan');

    let val = Decimal.atan(decimal);

    if (mode === TrigMode.Degrees) {
        // need to convert to radians
        val = convertToDegrees(val);
    }

    return LiteralNode.fromDecimal(val);
}

export function atanh(args: INode[], mode: TrigMode): INode {
    const [ arg ]= verifyArgs(1, 'atanh', args);
    const decimal = hasDecimal(arg, 'atanh');
    let val = Decimal.atanh(decimal);

    if (mode === TrigMode.Degrees) {
        // need to convert to radians
        val = convertToDegrees(val);
    }

    return LiteralNode.fromDecimal(val);
}

export function cos(args: INode[], mode: TrigMode): INode {
    const [ arg ]= verifyArgs(1, 'cos', args);
    let decimal = hasDecimal(arg, 'cos');

    if (mode === TrigMode.Degrees) {
        decimal = convertToRadians(decimal);
    }

    const val = Decimal.cos(decimal);
    return LiteralNode.fromDecimal(val);
}

export function cosh(args: INode[], mode: TrigMode): INode {
    const [ arg ]= verifyArgs(1, 'cosh', args);
    let decimal = hasDecimal(arg, 'cosh');

    if (mode === TrigMode.Degrees) {
        decimal = convertToRadians(decimal);
    }

    const dec = Decimal.cosh(decimal);
    return LiteralNode.fromDecimal(dec);
}

export function sin(args: INode[], mode: TrigMode): INode {
    const [ arg ]= verifyArgs(1, 'sin', args);
    let decimal = hasDecimal(arg, 'sin');

    if (mode === TrigMode.Degrees) {
        decimal = convertToRadians(decimal);
    }

    return LiteralNode.fromDecimal(Decimal.sin(decimal));
}

export function sinh(args: INode[], mode: TrigMode): INode {
    const [ arg ]= verifyArgs(1, 'sinh', args);
    let decimal = hasDecimal(arg, 'sinh');

    if (mode === TrigMode.Degrees) {
        decimal = convertToRadians(decimal);
    }

    const dec = Decimal.sinh(decimal);
    return LiteralNode.fromDecimal(dec);
}

export function tan(args: INode[], mode: TrigMode): INode {
    const [ arg ]= verifyArgs(1, 'tan', args);
    let decimal = hasDecimal(arg, 'tan');

    if (mode === TrigMode.Degrees) {
        decimal = convertToRadians(decimal);
    }

    const dec = Decimal.tan(decimal);
    return LiteralNode.fromDecimal(dec);
}

export function tanh(args: INode[], mode: TrigMode): INode {
    const [ arg ]= verifyArgs(1, 'tanh', args);
    let decimal = hasDecimal(arg, 'tanh');

    if (mode === TrigMode.Degrees) {
        decimal = convertToRadians(decimal);
    }

    const dec = Decimal.tanh(decimal);
    return LiteralNode.fromDecimal(dec);
}
