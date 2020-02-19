import { INode, INodeOptions, OperatorNode, SimplifyNodeOpts, SyntaxError } from '../../internal';

export class AssignmentNode extends OperatorNode {

    constructor(opts: INodeOptions) {
        super(opts);
    }

    clone(): AssignmentNode {
        return new AssignmentNode(this.opts);
    }

    simplify(opts?: SimplifyNodeOpts): INode {
        const argNodes = this.argNodes;

        if (argNodes.length < 2) {
            throw new SyntaxError(`Not enough arguments for define operator.`);
        }

        if (argNodes.length > 2) {
            throw new SyntaxError(`Too many arguments for define operator.`);
        }

        return this.argNodes[1].simplify(opts);
    }
}
