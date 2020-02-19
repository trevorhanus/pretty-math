import { Decimal } from 'decimal.js';
import { INode, LiteralNode } from '../internal';

export function expontential(): INode {
    return LiteralNode.fromDecimal(Decimal.exp(1));
}

export function pi(): INode {
    return LiteralNode.fromDecimal(Decimal.acos(-1));
}

export function infinity(): INode {
    return LiteralNode.fromDecimal(new Decimal(Infinity));
}
