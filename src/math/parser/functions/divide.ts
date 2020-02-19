import { Decimal } from 'decimal.js';
import { INode, isMatrixNode, LiteralNode, verifyArgs } from '../../internal';

export function divide(args: INode[]): INode {
    args = verifyArgs(2, 'divide', args);

    if (args.some(a => isMatrixNode(a))) {
        throw new SyntaxError(`Cannot divide matrices.`);
    }

    const decimal = Decimal.div(args[0].decimal, args[1].decimal);
    return LiteralNode.fromDecimal(decimal);
}
