import { Decimal } from 'decimal.js';
import { INode, isMatrixNode, LiteralNode, verifyArgs } from '../../internal';

export function abs(args: INode[]): INode {
    args = verifyArgs(1, 'abs', args);

    const arg = args[0];

    if (isMatrixNode(arg)) {
        return arg.map(item => {
            return abs([item]);
        });
    }

    const dec = Decimal.abs(arg.decimal);
    return LiteralNode.fromDecimal(dec);
}
