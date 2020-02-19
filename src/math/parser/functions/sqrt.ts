import { Decimal } from 'decimal.js';
import { INode, isMatrixNode, LiteralNode, verifyArgs } from '../../internal';

export function sqrt(args: INode[]): INode {
    args = verifyArgs(1, 'sqrt', args);

    const arg = args[0];

    if (isMatrixNode(arg)) {
        throw new SyntaxError(`Can't take sqrt of a matrix.`);
    }

    const dec = Decimal.sqrt(args[0].decimal);
    return LiteralNode.fromDecimal(dec);
}
