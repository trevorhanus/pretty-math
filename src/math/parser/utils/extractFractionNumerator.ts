import { INode } from '../nodes/interfaces';
import { isRootNodeType } from '../nodes/NodeUtils';

export function extractFractionNumerator(tree: INode): INode {
    if (tree == null) {
        return null;
    }

    if (isRootNodeType(tree)) {
        return extractFractionNumerator(tree.only);
    }

    if (tree.opts.prec && tree.opts.prec < 3) {
        return extractFractionNumerator(tree.right);
    }

    return tree;
}