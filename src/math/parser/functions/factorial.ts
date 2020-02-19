import Decimal from 'decimal.js';
import { hasDecimal, INode, LiteralNode, SyntaxError, verifyArgs } from '../../internal';

export function factorial(args: INode[]): INode {
    const [ arg ] = verifyArgs(1, 'factorial', args);
    const decimal = hasDecimal(arg, 'factorial');
    return LiteralNode.fromDecimal(_factorial(decimal));
}

const cache = {
    0: new Decimal(1),
    1: new Decimal(1),
    2: new Decimal(2),
    3: new Decimal(6),
    4: new Decimal(24),
    5: new Decimal(120),
};

function _factorial(dec: Decimal): Decimal {
    if (!dec.isInt()) {
        throw new SyntaxError('Argument for factorial must be a positive integer.');
    }

    const n = dec.toNumber();

    if (n < 0) {
        throw new SyntaxError('Cannot calculate factorial of a negative number.');
    }

    if (!cache[n]) {
        cache[n] = dec.times(_factorial(dec.minus(1)));
    }

    return cache[n];
}
