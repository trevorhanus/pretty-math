import { Decimal } from 'decimal.js';
import { hasDecimal, INode, LiteralNode, verifyArgs } from '../../internal';

export function ln(args: INode[]): INode {
    const [ arg ] = verifyArgs(1, 'ln', args);
    const decimal = hasDecimal(arg, 'ln');
    const dec = Decimal.ln(decimal);
    return LiteralNode.fromDecimal(dec);
}
