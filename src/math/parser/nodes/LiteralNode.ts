import { Decimal } from 'decimal.js';
import { BaseNode, INodeOptions, NodeFamily, NodeType, Token, TokenName } from '../../internal';

export class LiteralNode extends BaseNode {
    _type = NodeType.Operand;
    private _decimal: Decimal;

    constructor(opts: INodeOptions, decimal?: Decimal) {
        super(opts);
        this._decimal = decimal || createDecimal(opts.token.value);
    }

    get decimal(): Decimal {
        return this._decimal;
    }

    get tokenValue(): string {
        return this.token ? this.token.value : this._decimal ? this._decimal.toString() : '';
    }

    clone(): LiteralNode {
        return new LiteralNode(this.opts, this._decimal);
    }

    static fromDecimal(decimal: Decimal): LiteralNode {
        const token = new Token(TokenName.Literal, decimal.toString(), -1);

        const opts: INodeOptions = {
            token,
            family: NodeFamily.Literal,
        };

        return new LiteralNode(opts, decimal);
    }

    static NaN(): LiteralNode {
        return LiteralNode.fromDecimal(new Decimal(NaN));
    }
}

function createDecimal(tokenValue: string): Decimal {
    try {
        return new Decimal(tokenValue);
    } catch (e) {
        return null;
    }
}
