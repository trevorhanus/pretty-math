import { INode, isRootNodeType } from 'math';
import { Block, TOKEN_TO_BUILDER } from 'pretty-math2/internal';

export function blocksFromNodeTree(tree: INode): Block[] {
    if (tree == null) {
        return [];
    }

    if (isRootNodeType(tree)) {
        return blocksFromNodeTree(tree.children[0]);
    }

    const childBlocks = tree.children.map(childNode => blocksFromNodeTree(childNode));
    const builder = TOKEN_TO_BUILDER[tree.tokenName];
    if (builder) {
        const blocks = builder(tree, childBlocks);
        for (let i = 1; i < blocks.length; i++) {
            if (blocks[i - 1].type === 'math:supsub' && blocks[i].type === 'math:supsub') {
                if (!blocks[i - 1].childMap.sup.isNull) {
                    blocks[i].childMap.sup.addBlocks(...blocks[i - 1].childMap.sup.blocks);
                    blocks.splice(i - 1, 1);
                    i--;
                } else if (!blocks[i - 1].childMap.sub.isNull) {
                    blocks[i].childMap.sub.addBlocks(...blocks[i - 1].childMap.sub.blocks);
                    blocks.splice(i - 1, 1);
                    i--;
                }
            }
        }
        return blocks;
    }

    return [];
}
