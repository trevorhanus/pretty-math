import { AccessorNode, INode, isArrayNode, isImplicitMultiNode } from '../../internal';

export function replaceImplicitMultiplicationNodesWithAccessorNodesWhereApplicable(node: INode): INode {
    if (isImplicitMultiNode(node)) {
        // is right an array
        // AND
        // is left a node that is accessible by an index?
        let left = node.left;
        let right = node.right;

        if (isArrayNode(right) && isAccessible(left)) {
            // replace implicit operator with an AccessorNode
            const accessor = AccessorNode.create();
            accessor.setLocalSymbols(node.localSymbols);
            left = replaceImplicitMultiplicationNodesWithAccessorNodesWhereApplicable(left);
            right = replaceImplicitMultiplicationNodesWithAccessorNodesWhereApplicable(right);
            accessor.setChildren([left, right]);
            return accessor;
        }
    }

    // else just clone it
    const clone = node.clone();
    clone.setLocalSymbols(node.localSymbols);

    node.children.forEach(child => {
        clone.addChild(replaceImplicitMultiplicationNodesWithAccessorNodesWhereApplicable(child));
    });

    return clone;
}

function isAccessible(node: INode): boolean {
    return node && node.isAccessible;
}
