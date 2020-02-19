import { Decimal } from 'decimal.js';
import { allMatrices, INode, isMatrixNode, LiteralNode, MatrixNode, SyntaxError, verifyArgs } from '../../internal';

export function subtract(args: INode[]): INode {
    // got to have two args
    args = verifyArgs(2, 'subtract', args);

    if (args.some(a => isMatrixNode(a))) {
        return subtractMatrices(args);
    }

    const dec = Decimal.sub(args[0].decimal, args[1].decimal);
    return LiteralNode.fromDecimal(dec);
}

function subtractMatrices(args: INode[]): MatrixNode {
    if (!allMatrices(args)) {
        throw new SyntaxError('Matrix subtraction error.');
    }

    const [m1, m2] = args;

    if (!m1.sizeEquals(m2)) {
        throw new SyntaxError('Matrices must be the same size.');
    }

    return m1.map((e1, i, j) => {
        const e2 = m2.getItemOneBased(i, j);
        return subtract([e1, e2]);
    });
}
