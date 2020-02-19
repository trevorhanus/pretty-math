import {
    FuncDefinitionNode,
    INode,
    isDerivativeNode,
    isFuncDefinitionTree,
    isIntegralNode,
    isSymbolFam
} from '../../internal';

export function markLocalSymbols(node: INode, locals?: { [symbol: string]: true }) {
    locals = { ...locals };

    if (isSymbolFam(node) && locals[node.symbol]) {
        node.__isLocal = true;
    }

    if (isFuncDefinitionTree(node)) {
        // \dfunc{f,x} = x^2
        const localSymbols = (node.left as FuncDefinitionNode).getLocalSymbolNames();
        localSymbols.forEach(symbol => {
            locals[symbol] = true;
        });
    }

    if (isDerivativeNode(node)) {
        // \diff{x^{2}, x}
        const localSymbols = node.differentialsAsSymbolNames;
        localSymbols.forEach(symbol => {
            locals[symbol] = true;
        });
    }

    if (isIntegralNode(node)) {
        const symbol = node.wrtSymbolName;
        if (symbol) {
            locals[symbol] = true;
        }
    }

    node.setLocalSymbols(locals);

    node.children.forEach(child => {
        markLocalSymbols(child, locals);
    });
}
