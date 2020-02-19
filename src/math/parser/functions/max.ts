import { Decimal } from 'decimal.js';
import { hasDecimal, INode, LiteralNode } from '../../internal';

export function max(args: INode[]): INode {
    if (!args || args.length < 1) {
        throw new SyntaxError('Not enough args for max.');
    }

    args.every(a => hasDecimal(a, 'max'));

    const dec = Decimal.max(...args.map(n => n.decimal));
    return LiteralNode.fromDecimal(dec);
}
