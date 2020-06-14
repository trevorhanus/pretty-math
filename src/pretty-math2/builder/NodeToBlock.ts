import { INode, IOperatorNode, ISymbolNode, IntegralNode, isMissingNode, parseCalchub } from 'math';
import {
    Block,
    BlockFactory,
    TokenBuilderFn,
    blocksFromNodeTree,
} from 'pretty-math2/internal';
import { fromHex } from 'common';

export function atomic(node: INode): Block[] {
    return [BlockFactory.createBlock('atomic', { text: node.tokenValue })];
}

export function biop(op?: string): TokenBuilderFn {
    if (!op) {
        return (node: IOperatorNode, children: Block[][]) => {
            return [...children[0], ...children[1]];
        }
    }
    return (node: IOperatorNode, children: Block[][]) => {
        const block = BlockFactory.createBlock('atomic', { text: op });
        return [...children[0], block, ...children[1]];
    }
}

export function derivative(node: IOperatorNode): Block[] {
    const args = node.argNodes.map(arg => blocksFromNodeTree(arg));
    const block = BlockFactory.createBlock('math:derivative');
    block.childMap.inner.addBlocks(...args[0]);
    block.childMap.wrt.addBlocks(...args[1]);
    return [block];
}

export function diff(node: IOperatorNode, children: Block[][]): Block[] {
    const block = BlockFactory.createBlock('math:differential', { displayValue: 'd' });
    block.childMap.inner.addBlocks(...children[0]);
    return [block];
}

export function frac(node: IOperatorNode, children: Block[][]): Block[] {
    const args = node.argNodes.map(arg => blocksFromNodeTree(arg));
    const block = BlockFactory.createBlock('math:fraction');
    block.childMap.num.addBlocks(...args[0]);
    block.childMap.denom.addBlocks(...args[1]);
    return [block];
}

export function func(displayValue: string): TokenBuilderFn {
    return (node: IOperatorNode, children: Block[][]) => {
        const block = BlockFactory.createBlock('math:function', { displayValue: displayValue });
        block.childMap.inner.addBlocks(...children[0]);
        return [block];
    }
}

export function integral(node: IntegralNode): Block[] {
    const block = BlockFactory.createBlock('math:integral');
    block.childMap.inner.addBlocks(...blocksFromNodeTree(node.expression));
    block.childMap.wrt.addBlocks(...blocksFromNodeTree(node.wrt));
    if (!isMissingNode(node.leftBound) || !isMissingNode(node.rightBound)) {
        block.childMap.leftBound.addEndBlock();
        block.childMap.leftBound.addBlocks(...blocksFromNodeTree(node.leftBound));
        block.childMap.rightBound.addEndBlock();
        block.childMap.rightBound.addBlocks(...blocksFromNodeTree(node.rightBound));
    }
    return [block];
}

export function parens(left?: string, right?: string): TokenBuilderFn {
    return (node: INode, children: Block[][]): Block[] => {
        const leftBlock = BlockFactory.createBlock('math:leftParen', { text: left });
        const rightBlock = BlockFactory.createBlock('math:rightParen', { text: right });
        return [leftBlock, ...children[0], rightBlock];
    }
}

export function partialDiff(node: INode, children: Block[][]): Block[] {
    const block = BlockFactory.createBlock('math:differential', { displayValue: '∂' });
    block.childMap.inner.addBlocks(...children[0]);
    return [block];
}

export function skip(node: INode): Block[] {
    return [];
}

export function sqrt(node: INode, children: Block[][]): Block[] {
    const block = BlockFactory.createBlock('math:radical');
    block.childMap.inner.addBlocks(...children[0]);
    return [block];
}

export function sup(node: INode, children: Block[][]): Block[] {
    const block = BlockFactory.createBlock('math:supsub')
    block.childMap.sup.addBlocks(...children[1])
    return [...children[0], block];
}

export function symbol(node: ISymbolNode): Block[] {
    const blocks = [];
    const parts = node.tokenValue.split('_');
    parts[0].split('').forEach(val => {
        blocks.push(BlockFactory.createBlock('atomic', { text: val }));
    });
    if (parts.length > 1) {
        const block = BlockFactory.createBlock('math:supsub');
        if (parts[1].length >= 4) {
            const decoded = fromHex(parts[1]);
            block.childMap.sub.addBlocks(...blocksFromNodeTree(parseCalchub(decoded).root));
            blocks.push(block);
        }
    }
    return blocks;
}

export function unary(node: IOperatorNode, children: Block[][]): Block[] {
    if (node.isRightAssoc) {
        return [BlockFactory.createBlock('atomic', { text: node.tokenValue }), ...children[0]];
    }
    return [...children[0], BlockFactory.createBlock('atomic', { text: node.tokenValue })];
}
