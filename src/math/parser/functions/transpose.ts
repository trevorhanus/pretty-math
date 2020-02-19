import { INode, isMatrixNode, MatrixNode, verifyArgs } from '../../internal';

export function transpose(args: INode[]): INode {
    const [ arg ] = verifyArgs(1, 'transpose', args);

    if (!isMatrixNode(arg)) {
        throw new SyntaxError('Invalid argument for transpose.');
    }

    return (arg as MatrixNode).transpose();
}
