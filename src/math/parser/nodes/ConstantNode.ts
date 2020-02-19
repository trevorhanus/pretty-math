import { BaseNode, EvalFunction, INode, INodeOptions, NodeType } from '../../internal';

export class ConstantNode extends BaseNode {
    _type = NodeType.Operand;
    private _eval: EvalFunction;

    constructor(opts: INodeOptions) {
        super(opts);
        this._eval = opts.eval.bind(this);
    }

    clone(): ConstantNode {
        return new ConstantNode(this.opts);
    }

    simplify(): INode {
        return this._eval();
    }
}
