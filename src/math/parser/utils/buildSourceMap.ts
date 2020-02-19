import { INode, NodeSourceMap, walkTree } from '../../internal';

export function buildSourceMapFromTree(tree: INode): NodeSourceMap {
    const sourceMap: NodeSourceMap = {};

    walkTree(tree, node => {
        const start = node.tokenStart;
        const end = node.tokenEnd;

        if (start < 0 || end < 0) {
            return;
        }

        for (let i = start; i <= end; i++) {
            sourceMap[i] = node;
        }
    });

    return sourceMap;
}
