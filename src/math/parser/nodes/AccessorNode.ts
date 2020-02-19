import {
    BaseNode,
    INode,
    INodeOptions,
    isArrayNode,
    isMatrixNode,
    SimplifyNodeOpts,
    SyntaxError
} from '../../internal';

export class AccessorNode extends BaseNode {

    constructor(opts: INodeOptions) {
        super(opts);
    }

    get object(): INode {
        return this._children[0];
    }

    get tokenEnd(): number {
        return -1;
    }

    get tokenStart(): number {
        return -1;
    }

    get tokenValue(): string {
        return 'accessor';
    }

    clone(): AccessorNode {
        return new AccessorNode(this.opts);
    }

    simplify(opts?: SimplifyNodeOpts): INode {
        const left = this.left;
        const right = this.right;

        if (isArrayNode(left)) {
            // arrays are zero-based
            const arrayIndex = isArrayNode(right) && right.length === 1 && right.first;

            if (!arrayIndex) {
                throw new SyntaxError('Invalid index for array.');
            }

            const child = left.children[arrayIndex.primitiveNumber];

            if (!child) {
                throw new SyntaxError(`Index ${arrayIndex.primitiveNumber} doesn't exist.`);
            }

            return child;
        }

        if (isMatrixNode(left)) {
            const row = isArrayNode(right) && right.length === 2 && right.children[0];
            const col = isArrayNode(right) && right.length === 2 && right.children[1];

            if (!row || !col) {
                throw new SyntaxError('Invalid index for matrix.');
            }

            // matrices are one-based
            const i = row.primitiveNumber - 1;
            const j = col.primitiveNumber - 1;

            const item = left.getItemOneBased(i, j);

            if (!item) {
                throw new SyntaxError(`Index [${i},${j}] doesn't exist.`);
            }

            return item;
        }

        throw new SyntaxError(`${left.type} node type can't be accessed by an index.`);
    }

    static create(): AccessorNode {
        const opts: INodeOptions = {
            calchub: '$0[$1]',
        };

        return new AccessorNode(opts);
    }

}
