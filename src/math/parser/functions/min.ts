import { Decimal } from 'decimal.js';
import { hasDecimal, INode, LiteralNode } from '../../internal';

export function min(args: INode[]): INode {
    if (!args || args.length < 1) {
        throw new SyntaxError('Not enough args for min.');
    }

    args.every(a => hasDecimal(a, 'min'));

    const dec = Decimal.min(...args.map(n => n.decimal));
    return LiteralNode.fromDecimal(dec);
}
