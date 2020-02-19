import { INode, INodeOptions, isCommaNode, OperatorNode } from '../../internal';

export class CommaNode extends OperatorNode {

    constructor(opts: INodeOptions) {
        super(opts);
    }

    clone(): CommaNode {
        return new CommaNode(this.opts);
    }

    flatten(): INode[] {
        return [].concat(...this._children.map(c => {
            return isCommaNode(c) ? c.flatten() : c;
        }));
    }
}
