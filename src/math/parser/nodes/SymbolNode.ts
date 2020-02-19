import {
    BaseNode,
    getPythonSafeSymbol,
    INodeOptions,
    ISymbolNode,
    NodeType,
    outputFromString,
    StringOutput,
    Token,
    TokenName
} from '../../internal';

export class SymbolNode extends BaseNode implements ISymbolNode {
    __isLocal: boolean;
    protected _type = NodeType.Operand;

    constructor(opts: INodeOptions) {
        super(opts);
        this.__isLocal = false;
    }

    get isAccessible(): boolean {
        return true;
    }

    get isLocal(): boolean {
        return this.__isLocal;
    }

    get isSymbolic(): boolean {
        return true;
    }

    get symbol(): string {
        return this.tokenValue;
    }

    get pythonSafeSymbol(): string {
        return getPythonSafeSymbol(this.symbol);
    }

    get tokenValue(): string {
        return this.token && this.token.value;
    }

    clone(): SymbolNode {
        const sym = new SymbolNode(this.opts);
        sym.__isLocal = this.__isLocal;
        return sym;
    }

    cloneWithNewSymbol(newSymbol: string): SymbolNode {
        const token = new Token(TokenName.Symbol, newSymbol);
        const node = new SymbolNode({ ...this.opts, token });
        node.__isLocal = this.__isLocal;
        return node;
    }

    toPython(): StringOutput {
        return outputFromString(this.pythonSafeSymbol, this);
    }

    static fromSymbol(symbol: string, oldSymbolNode?: ISymbolNode): SymbolNode {
        const token = new Token(TokenName.Symbol, symbol);
        const node = new SymbolNode({ token });
        if (oldSymbolNode) {
            node.__isLocal = oldSymbolNode.__isLocal;
        }
        return node;
    }
}
