import { Decimal } from 'decimal.js';
import {
    INode,
    INodeOptions,
    isSymbolFam,
    LocalSymbolMap,
    NodeFamily,
    NodeType,
    omitNulls,
    outputFromString,
    OutputTemplate,
    SimplifyNodeOpts,
    StringOutput,
    Token,
    TokenName
} from '../../internal';

export class BaseNode implements INode {
    readonly __isNode = true;
    protected _calchubTemplate: OutputTemplate<INode>;
    protected _children: INode[];
    protected _family: NodeFamily;
    private _localSymbols: LocalSymbolMap;
    private _parent: INode;
    protected _pythonTemplate: OutputTemplate<INode>;
    protected _type: NodeType;
    readonly opts: INodeOptions;
    readonly token: Token;

    constructor(opts: INodeOptions) {
        this.token = opts.token;
        this.opts = opts;
        this._children = [];
        this._family = opts.family != null ? opts.family : this._family;
        this._localSymbols = null;
        this._parent = null;
        this._calchubTemplate = this.opts.calchub && new OutputTemplate<INode>(this.opts.calchub, this);
        this._pythonTemplate = this.opts.python && new OutputTemplate<INode>(opts.python, this);
    }

    get children(): INode[] {
        return this._children;
    }

    get decimal(): Decimal {
        return new Decimal(NaN);
    }

    get family(): NodeFamily {
        return this._family;
    }

    get isAccessible(): boolean {
        return false;
    }

    get isSymbol(): boolean {
        return false;
    }

    get isSymbolic(): boolean {
        return this.children.some(c => c.isSymbolic);
    }

    get left(): INode {
        return this._children.length > 0 ? this._children[0] : null;
    }

    get localSymbols(): LocalSymbolMap {
        return this._localSymbols;
    }

    get parent(): INode {
        return this._parent;
    }

    get primitiveNumber(): number {
        return this.decimal != null ? this.decimal.toNumber() : NaN;
    }

    get right(): INode {
        return this._children.length > 1 ? this._children[1] : null;
    }

    get root(): INode {
        return this.parent ? this.parent.root : this;
    }

    protected get templateSubs(): INode[] {
        return this._children;
    }

    get tokenEnd(): number {
        return this.token ? this.token.end : -1;
    }

    get tokenLength(): number {
        return this.token ? this.token.length : 0;
    }

    get tokenName(): TokenName {
        return this.token && this.token.name;
    }

    get tokenStart(): number {
        return this.token ? this.token.start : -1;
    }

    get tokenValue(): string {
        return this.token ? this.token.value : null;
    }

    get type(): NodeType {
        return this._type;
    }

    addChild(child: INode) {
        if (!child) {
            return;
        }

        child.setParent(this);
        this._children.push(child);
    }

    clone(): INode {
        return new BaseNode(this.opts);
    }

    cloneDeep(): INode {
        const clone = this.clone();
        this.children.forEach(child => {
            clone.addChild(child.cloneDeep());
        });
        return clone;
    }

    forEach(iterator: (node: INode) => void): void {
        iterator(this);
        this.children.forEach(child => {
            child.forEach(iterator);
        });
    }

    replaceChild(child: INode, newChild: INode) {
        if (!newChild) {
            return;
        }

        const i = this._children.indexOf(child);

        if (i > -1) {
            child.setParent(null);
            newChild.setParent(this);
            this._children.splice(i, 1, newChild);
        }
    }

    setChildren(children: INode[]) {
        children.forEach(child => {
            this.addChild(child);
        });
    }

    setLocalSymbols(map: LocalSymbolMap) {
        this._localSymbols = { ...map };
    }

    setParent(node: INode) {
        this._parent = node;
    }

    simplify(opts?: SimplifyNodeOpts): INode {
        return this.cloneDeep();
    }

    toCalchub(): StringOutput {
        if (this._calchubTemplate) {
            return this._calchubTemplate.buildOutput(this.templateSubs.map(n => n.toCalchub()));
        } else {
            return outputFromString(this.tokenValue, this);
        }
    }

    toPython(): StringOutput {
        if (this._pythonTemplate) {
            return this._pythonTemplate.buildOutput(this.templateSubs.map(n => n.toPython()));
        } else {
            return outputFromString(this.tokenValue, this);
        }
    }

    toShorthand(): any {
        let tokenValue = this.tokenValue;

        if (this.type === NodeType.Operand) {
            if (isSymbolFam(this) && this.isLocal) {
                return `loc:${tokenValue}`;
            }
            return tokenValue;
        }

        if (this.tokenName === TokenName.UserDefinedFunc) {
            tokenValue = `udf:${this.tokenValue}`;
        }

        if (this.tokenName === TokenName.Negate) {
            tokenValue = 'neg';
        }

        return omitNulls({
            op: tokenValue,
            left: this.children[0] && this.children[0].toShorthand(),
            right: this.children[1] && this.children[1].toShorthand(),
        });
    }
}
