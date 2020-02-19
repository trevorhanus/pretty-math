import {
    Assoc,
    BaseNode,
    EvalFunction,
    INode,
    INodeOptions,
    IOperatorNode,
    isCommaNode,
    isFuncFam,
    isOperatorType,
    NodeType,
    outputFromString,
    OutputTemplate,
    SimplifyNodeOpts,
    StringOutput,
    TokenName
} from '../../internal';

export class OperatorNode extends BaseNode implements IOperatorNode {
    protected _type = NodeType.Operator;
    private _eval: EvalFunction;

    constructor(opts: INodeOptions) {
        super(opts);
        this._eval = opts.eval && opts.eval.bind(this);
    }

    get argNodes(): INode[] {
        return [].concat(...this._children.map(child => {
            return isCommaNode(child) ? child.flatten() : child;
        }));
    }

    get assoc(): Assoc {
        return this.opts.assoc;
    }

    get isLeftAssoc(): boolean {
        return this.assoc === Assoc.Left;
    }
    
    get isRightAssoc(): boolean {
        return this.assoc === Assoc.Right;
    }

    get nArgs(): number {
        return this.opts.nArgs;
    }

    get prec(): number {
        return this.opts.prec;
    }

    clone(): OperatorNode {
        return new OperatorNode(this.opts);
    }

    forEach(iterator: (node: INode) => void): void {
        iterator(this);
        this.children.forEach(node => {
            node.forEach(iterator);
        });
    }

    simplify(opts?: SimplifyNodeOpts): INode {
        opts = opts || {};
        if (!this.isSymbolic && this._eval) {
            const args = this.argNodes.map(n => n.simplify(opts));
            return this._eval(args, opts.trigMode);
        } else {
            return super.simplify(opts);
        }
    }

    toCalchub(): StringOutput {
        const subs = this.templateSubs.map(n => {
            const sub = n.toCalchub();
            if (isOperatorType(n) && !isFuncFam(this) && n.prec < this.prec) {
                return OutputTemplate.compile<INode>('($0)', n).buildOutput([sub]);
            } else {
                return sub;
            }
        });

        if (this._calchubTemplate) {
            return this._calchubTemplate.buildOutput(subs);
        } else {
            return outputFromString(this.tokenValue, this);
        }
    }

    toPython(): StringOutput {
        let templateSubs = this.templateSubs;

        if (this.tokenName === TokenName.Frac) {
            // flatten out the comma nodes for the
            // python template
            templateSubs = this.argNodes;
        }

        const subs = templateSubs.map(n => {
            const sub = n.toPython();
            if (isOperatorType(n) && !isFuncFam(this) && n.prec < this.prec) {
                return OutputTemplate.compile<INode>('($0)', n).buildOutput([sub]);
            } else {
                return sub;
            }
        });

        if (this._pythonTemplate) {
            return this._pythonTemplate.buildOutput(subs);
        } else {
            return outputFromString(this.tokenValue, this);
        }
    }

    toShorthand(): any {
        if (this.tokenName === TokenName.Array) {
            return {
                op: '[]',
                items: this.children.map(c => c.toShorthand()),
            }
        }

        const shorthand: any = super.toShorthand();

        if (this.left != null) {
            shorthand.left = this.left.toShorthand();
        }

        if (this.right != null) {
            shorthand.right = this.right.toShorthand();
        }

        return shorthand;
    }
}
