import { Decimal } from 'decimal.js';
import {
    hasDecimal,
    INode,
    isMatrixNode,
    LiteralNode,
    MatrixNode,
    multiply,
    posInteger,
    verifyArgs
} from '../../internal';

export function pow(args: INode[]): INode {
    const [ arg1, arg2 ] = verifyArgs(2, 'power', args);

    if (isMatrixNode(arg1)) {
        return matrixPower(args);
    }

    const dec1 = hasDecimal(arg1, 'power');
    const dec2 = hasDecimal(arg2, 'power');
    const decimal = Decimal.pow(dec1, dec2);
    return LiteralNode.fromDecimal(decimal);
}

function matrixPower(args: INode[]): MatrixNode {
    const [ arg1, arg2 ] = verifyArgs(2, 'power', args);

    const decimal = hasDecimal(arg2, 'matrix power');

    let m = arg1 as MatrixNode;

    if (decimal.equals(-1)) {
        return inverse(m);
    }

    const n = posInteger(arg2, 'matrix power').toNumber();

    if (n === 1) {
        return m;
    }

    for (let i = 1; i < n; i++) {
        m = multiply([m, m]) as MatrixNode;
    }

    return m;
}

function inverse(m: MatrixNode): MatrixNode {
    throw new SyntaxError('Inverse of a Matrix is not implemented.');
}
