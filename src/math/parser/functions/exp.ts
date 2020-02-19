import { Decimal } from 'decimal.js';
import { hasDecimal, INode, LiteralNode, verifyArgs } from '../../internal';

export function exp(args: INode[]): INode {
    const [ arg ] = verifyArgs(1, 'exp', args);
    const decimal = hasDecimal(arg, 'exp');
    const dec = Decimal.exp(decimal);
    return LiteralNode.fromDecimal(dec);
}
