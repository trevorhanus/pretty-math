import { INode, INodeOptions, isParensType, NodeType, OperatorNode, TokenName } from '../../internal';

export interface ParensNodeOpts extends INodeOptions {
    parens: string;
    parensPair: string;
}

export class ParensNode extends OperatorNode {
    protected _type = NodeType.Parens;
    readonly parens: string;
    readonly parensPair: string;

    constructor(opts: ParensNodeOpts) {
        super(opts);
        this.parens = opts.parens;
        this.parensPair = opts.parensPair;
    }

    get isArrayCloser(): boolean {
        return this.tokenName === TokenName.ArrayCloser;
    }

    get isArrayOpener(): boolean {
        return this.tokenName === TokenName.ArrayOpener;
    }

    isParensPair(node: INode): boolean {
        return isParensType(node) && this.parensPair === node.parens;
    }

}
