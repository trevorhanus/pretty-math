import { INode, INodeOptions, isSymbolFam, OperatorNode } from '../../internal';

export class IntegralNode extends OperatorNode {

    constructor(opts: INodeOptions) {
        super(opts);
    }

    get expression(): INode {
        return this.argNodes[0] || null;
    }

    get isSymbolic(): boolean {
        return true;
    }

    get leftBound(): INode {
        return this.argNodes[2] || null;
    }

    get rightBound(): INode {
        return this.argNodes[3] || null;
    }

    get wrt(): INode {
        return this.argNodes[1] || null;
    }

    get wrtSymbolName(): string {
        return isSymbolFam(this.wrt) ? this.wrt.symbol : null;
    }

    clone(): IntegralNode {
        return new IntegralNode(this.opts);
    }
}
