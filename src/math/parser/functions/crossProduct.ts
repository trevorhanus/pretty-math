import { INode, isMatrixNode, MatrixNode, multiply, subtract, verifyArgs } from '../../internal';

export function crossProduct(args: INode[]): INode {
    const [ arg1, arg2 ] = verifyArgs(2, 'cross product', args);

    // both must be vectors
    if (!args.every(a => isVector(a))) {
        throw new SyntaxError('Both arguments for cross product must be vectors.');
    }

    const a = arg1 as MatrixNode;
    const b = arg2 as MatrixNode;

    const s1 = subtract([
        multiply([a.getItemOneBased(1, 2), b.getItemOneBased(1, 3)]),
        multiply([a.getItemOneBased(1, 3), b.getItemOneBased(1, 2)]),
    ]);

    const s2 = subtract([
        multiply([a.getItemOneBased(1, 3), b.getItemOneBased(1, 1)]),
        multiply([a.getItemOneBased(1, 1), b.getItemOneBased(1, 3)]),
    ]);

    const s3 = subtract([
        multiply([a.getItemOneBased(1, 1), b.getItemOneBased(1, 2)]),
        multiply([a.getItemOneBased(1, 2), b.getItemOneBased(1, 1)]),
    ]);

    return MatrixNode.fromItems([[s1, s2, s3]]);
}

function isVector(m: INode): boolean {
    return isMatrixNode(m) && m.isSize(1, 3);
}
