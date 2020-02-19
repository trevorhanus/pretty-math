import { INode, INodeOptions, isExponentialConstantNode, OperatorNode, Output, OutputTemplate } from '../../internal';

export class PowerNode extends OperatorNode {

    constructor(opts: INodeOptions) {
        super(opts);
    }

    clone(): PowerNode {
        return new PowerNode(this.opts);
    }

    toPython(): Output<INode> {
        // check if our left child is a the exp constant
        if (isExponentialConstantNode(this.left)) {
            const template = OutputTemplate.compile('exp($0)', this.left);

            const subs = [];
            if (this.right) {
                subs.push(this.right.toPython());
            }

            return template.buildOutput(subs);
        }

        return super.toPython();
    }

}
