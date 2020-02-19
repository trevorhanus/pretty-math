import { BaseNode, INodeOptions, NodeType } from '../../internal';

export class MissingNode extends BaseNode {
    _type = NodeType.Operand;

    constructor(opts: INodeOptions) {
        super(opts);
    }

    get isSymbolic(): boolean {
        return true;
    }

    clone(): MissingNode {
        return new MissingNode(this.opts);
    }

    toShorthand() {
        return '?';
    }
}
