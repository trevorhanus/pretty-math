import { buildNode, INode, INodeOptions, isCommaNode, OperatorNode, ParensNode, Token, TokenName } from '../../internal';

export class ArrayNode extends OperatorNode {
    opener: ParensNode;
    closer: ParensNode;

    constructor(opts: INodeOptions) {
        super(opts);
    }

    get first(): INode {
        return this.children[0];
    }

    get isAccessible(): boolean {
        return true;
    }

    get length(): number {
        return this.children.length;
    }

    clone(): ArrayNode {
        return new ArrayNode(this.opts);
    }

    static fromArg(argNode: INode): ArrayNode {
        const items = isCommaNode(argNode) ? argNode.flatten() : [argNode];
        return ArrayNode.fromNodes(items);
    }

    static fromNodes(nodes: INode[]): ArrayNode {
        const token = new Token(TokenName.Array, '');
        const array = buildNode(token) as ArrayNode;
        nodes.forEach(item => array.addChild(item));
        return array;
    }
}
