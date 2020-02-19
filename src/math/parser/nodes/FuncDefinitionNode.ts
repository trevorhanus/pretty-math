import { INodeOptions, isSymbolFam, OperatorNode } from '../../internal';

export class FuncDefinitionNode extends OperatorNode {

    constructor(opts: INodeOptions) {
        super(opts);
    }

    get fnName(): string {
        const arg = this.argNodes[0];
        return arg && isSymbolFam(arg) && arg.symbol;
    }

    get isSymbolic(): boolean {
        return true;
    }

    clone(): FuncDefinitionNode {
        return new FuncDefinitionNode(this.opts);
    }

    getLocalSymbolNames(): string[] {
        const localSymbols = [];
        const args = this.argNodes;

        // first arg is the func name
        // so start at index = 1
        let i = 1;
        for (i; i < args.length; i++) {
            const arg = args[i];
            if (isSymbolFam(arg)) {
                localSymbols.push(arg.symbol);
            }
        }

        return localSymbols;
    }

}
