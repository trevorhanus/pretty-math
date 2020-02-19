import { INode, isMatrixNode, MatrixNode, multiply, sum, verifyArgs } from '../../internal';

export function dotProduct(args: INode[]): INode {
    const [ arg1, arg2 ] = verifyArgs(2, 'dot product', args);

    // both must be matrices
    if (!args.every(a => isMatrixNode(a))) {
        throw new SyntaxError('Arguments for dot product must be same size matrices.');
    }

    const a = arg1 as MatrixNode;
    const b = arg2 as MatrixNode;

    if (!a.sizeEquals(b)) {
        throw new SyntaxError('Arguments for dot product must be same size matrices.');
    }

    const items: INode[] = [];

    for (let i = 1; i <= a.nRows; i++) {
        for (let j = 1; j <= a.nCols; j++) {
            const a_ij = a.getItemOneBased(i, j);
            const b_ij = b.getItemOneBased(i, j);
            items.push(multiply([a_ij, b_ij]));
        }
    }

    return sum(items);
}
