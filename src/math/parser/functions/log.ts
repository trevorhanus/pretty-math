import { Decimal } from 'decimal.js';
import { hasDecimal, INode, LiteralNode, posInteger, SyntaxError } from '../../internal';

export function log(args: INode[]): INode {
    args = args || [];

    if (args.length < 1) {
        throw new SyntaxError(`Not enough arguments for log.`);
    }

    if (args.length > 2) {
        throw new SyntaxError(`Too many arguments for log.`);
    }

    const arg = hasDecimal(args[0], 'log');
    const base = args[1] ? posInteger(args[1], 'log base') : 10;
    const dec = Decimal.log(arg, base);
    return LiteralNode.fromDecimal(dec);
}
