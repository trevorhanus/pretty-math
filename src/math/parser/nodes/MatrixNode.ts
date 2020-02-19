import {
    ArrayNode,
    buildNode,
    INode,
    INodeOptions,
    isArrayNode,
    isMatrixNode,
    isMissingNode,
    MathSyntaxError,
    OperatorNode,
    SimplifyNodeOpts,
    Token,
    TokenName
} from '../../internal';

export class MatrixNode extends OperatorNode {

    constructor(opts: INodeOptions) {
        super(opts);
    }

    get child(): INode {
        return this.children[0];
    }

    get isAccessible(): boolean {
        return true;
    }

    get nCols(): number {
        const firstRow = this.rows[0];
        if (!firstRow) {
            return 0;
        }
        if (!isArrayNode(firstRow)) {
            return 1;
        }
        return firstRow.length;
    }

    get nRows(): number {
        return this.rows.length;
    }

    get rows(): INode[] {
        if (isArrayNode(this.child)) {
            return this.child.children;
        }

        if (isMissingNode(this.child)) {
            return [];
        }

        return [this.child];
    }

    clone(): MatrixNode {
        return new MatrixNode(this.opts);
    }

    getItemOneBased(i: number, j: number): INode {
        const row = this.rows[i - 1];
        return row ? row.children[j - 1] : null;
    }

    isSize(i: number, j: number): boolean {
        return this.nRows === i && this.nCols === j;
    }

    isSquare(): boolean {
        return this.nRows === this.nCols;
    }

    map(iterator: (node: INode, i: number, j: number) => INode): MatrixNode {
        const newRows: INode[][] = [];

        const nRows = this.nRows;
        const nCols = this.nCols;

        for (let i = 1; i <= nRows; i++) {
            const row: INode[] = [];

            for (let j = 1; j <= nCols; j++) {
                const arg = this.getItemOneBased(i, j);
                row.push(iterator(arg, i, j));
            }

            newRows.push(row);
        }

        return MatrixNode.fromItems(newRows);
    }

    setChildren(children: INode[]) {
        if (children.length !== 1) {
            throw new MathSyntaxError('Invalid matrix.');
        }

        // has to be an array of arrays
        const child = children[0];

        if (!isArrayNode(child)) {
            throw new MathSyntaxError('Invalid matrix.');
        }

        let cols = null;
        child.children.forEach(c => {
            if (!isArrayNode(c)) {
                throw new MathSyntaxError('Invalid matrix.');
            }

            cols = cols || c.length;

            if (cols !== c.length) {
                throw new MathSyntaxError('Invalid matrix.');
            }
        });

        super.setChildren(children);
    }

    simplify(opts?: SimplifyNodeOpts): INode {
        return this.map(item => item.simplify(opts));
    }

    sizeEquals(node: INode): boolean {
        if (!isMatrixNode(node)) {
            return false;
        }

        return this.nCols === node.nCols && this.nRows === node.nRows;
    }

    transpose(): MatrixNode {
        const newRows: INode[][] = [];

        const nRows = this.nRows;
        const nCols = this.nCols;

        for (let i = 1; i <= nRows; i++) {
            for (let j = 1; j <= nCols; j++) {
                newRows[j] = newRows[j] || [];
                newRows[j].push(this.getItemOneBased(i, j).cloneDeep());
            }
        }

        return MatrixNode.fromItems(newRows);
    }

    static fromItems(nodes: INode[][]): MatrixNode {
        const token = new Token(TokenName.Matrix, '\\matrix');
        const matrix = buildNode(token) as MatrixNode;
        const rows: ArrayNode[] = [];
        nodes.forEach(row => {
            rows.push(ArrayNode.fromNodes(row));
        });
        matrix.setChildren([ArrayNode.fromNodes(rows)]);
        return matrix;
    }
}
