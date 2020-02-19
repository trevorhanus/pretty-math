import { extractDifferentialSymbolNames, INode, INodeOptions, isCommaNode, OperatorNode } from '../../internal';

export class DerivativeNode extends OperatorNode {

    constructor(opts: INodeOptions) {
        super(opts);
    }

    get differentialsAsSymbolNames(): string[] {
        return extractDifferentialSymbolNames(this);
    }

    get expression(): INode {
        return isCommaNode(this.left) ? this.left.left : null;
    }

    get isSymbolic(): boolean {
        return true;
    }

    get wrt(): INode {
        return isCommaNode(this.left) ? this.left.right : null;
    }

    clone(): DerivativeNode {
        return new DerivativeNode(this.opts);
    }
}
