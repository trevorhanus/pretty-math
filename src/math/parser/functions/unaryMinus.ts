import { Decimal } from 'decimal.js';
import { INode, isMatrixNode, LiteralNode, verifyArgs } from '../../internal';

export function unaryMinus(args: INode[]): INode {
    args = verifyArgs(1, 'minus sign', args);

    const arg = args[0];

    if (isMatrixNode(arg)) {
        return arg.map(item => {
            return unaryMinus([item]);
        });
    }

    const dec = (new Decimal(args[0].decimal)).neg();
    return LiteralNode.fromDecimal(dec);
}
