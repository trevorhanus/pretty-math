import { Decimal } from 'decimal.js';
import { INode, isMatrixNode, LiteralNode, MatrixNode, sum, SyntaxError, verifyArgs } from '../../internal';

export function multiply(args: INode[]): INode {
    args = verifyArgs(2, 'multiply', args);

    if (args.every(a => isMatrixNode(a))) {
        return multiplyMatrices(args as MatrixNode[]);
    }

    if (args.some(a => isMatrixNode(a))) {
        return scalar(args);
    }

    const decimal = Decimal.mul(args[0].decimal, args[1].decimal);
    return LiteralNode.fromDecimal(decimal);
}

function scalar(args: INode[]): INode {
    const scalar = args.find(a => a.decimal && !a.decimal.isNaN());
    const m = args.find(a => isMatrixNode(a)) as MatrixNode;

    return m.map(item => {
        return multiply([scalar, item]);
    });
}

function multiplyMatrices(args: MatrixNode[]): MatrixNode {
    const [a, b] = args;

    // inner dimensions must match
    const aCols = a.nCols;
    const bRows = b.nRows;

    if (aCols !== bRows) {
        throw new SyntaxError(`Matrix dimensions do not match.`);
    }

    const n = aCols;
    const m = a.nRows;
    const p = b.nCols;

    const rows = [];

    for (let i = 1; i <= m; i++) {
        const row = [];

        for (let j = 1; j <= p; j++) {
            const parts = [];

            for (let k = 1; k <= n; k++) {
                const a_i_k = a.getItemOneBased(i, k);
                const b_k_j = b.getItemOneBased(k, j);
                parts.push(multiply([a_i_k, b_k_j]));
            }

            row.push(sum(parts))
        }

        rows.push(row);
    }

    return MatrixNode.fromItems(rows);
}
