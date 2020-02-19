import { Decimal } from 'decimal.js';
import { allMatrices, INode, isMatrixNode, LiteralNode, MatrixNode, SyntaxError, verifyArgs } from '../../internal';

export function add(args: INode[]): INode {
    // got to have two args
    args = verifyArgs(2, 'add', args);

    if (args.some(a => isMatrixNode(a))) {
        return addMatrices(args);
    }

    const dec = Decimal.add(args[0].decimal, args[1].decimal);
    return LiteralNode.fromDecimal(dec);
}

function addMatrices(args: INode[]): MatrixNode {
    if (!allMatrices(args)) {
        throw new SyntaxError('Matrix addition error.');
    }

    const [m1, m2] = args;

    if (!m1.sizeEquals(m2)) {
        throw new SyntaxError('Matrices must be the same size.');
    }

    return m1.map((e1, i, j) => {
        const e2 = m2.getItemOneBased(i, j);
        return add([e1, e2]);
    });
}
