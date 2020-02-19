import { BaseNode, INode, joinOutputs, NodeType, SimplifyNodeOpts, StringOutput } from '../../internal';

export class RootNode extends BaseNode {
    protected _type = NodeType.Root;

    constructor() {
        super({})
    }

    get only(): INode {
        return this.children.length === 1 ? this.children[0] : null;
    }

    get tokenStart(): number {
        return -1;
    }

    get tokenLength(): number {
        return -1;
    }

    get tokenValue(): string {
        return null;
    }

    clone(): RootNode {
        return new RootNode();
    }

    simplify(opts?: SimplifyNodeOpts): INode {
        // if there's more than one child
        // then there was some sort of error
        return this.only ? this.only.simplify(opts) : null;
    }

    toCalchub(): StringOutput {
        return joinOutputs(...this.children.map(c => c.toCalchub()));
    }

    toPython(): StringOutput {
        return joinOutputs(...this.children.map(c => c.toPython()));
    }

    toShorthand(): any {
        return {
            op: 'root',
            children: this.children.map(child => child.toShorthand()),
        };
    }
}
