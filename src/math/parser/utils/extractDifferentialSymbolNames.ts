import {
    fillArray,
    INode,
    IOperatorNode,
    isAnyDifferentialNode,
    isDerivativeNode,
    isImplicitMultiNode,
    isLiteralFam,
    isMissingNode,
    isPowerNode,
    isRootNodeType,
    isSymbolFam,
    MathSyntaxError
} from '../../internal';

export function extractDifferentialSymbolNames(tree: INode): string[] {
    if (tree == null) {
        return [];
    }

    if (isRootNodeType(tree)) {
        return extractDifferentialSymbolNames(tree.only);
    }

    // only four valid node types

    // 1) DerivativeNode
    // 1) differential: \wrt{} or \pwrt{}
    // 2) implicit multiplication
    // 3) power

    if (isDerivativeNode(tree)) {
        return extractDifferentialSymbolNames(tree.wrt);
    }

    if (isAnyDifferentialNode(tree)) {
        return extractDifferentialSymbolNamesFromAnyDifferentialNode(tree);
    }

    if (isImplicitMultiNode(tree)) {
        return [...extractDifferentialSymbolNames(tree.left), ...extractDifferentialSymbolNames(tree.right)];
    }

    if (isPowerNode(tree) && isAnyDifferentialNode(tree.left)) {
        return extractDifferentialSymbolNamesFromPowerNode(tree);
    }

    throw new MathSyntaxError(`Invalid differential syntax '${tree.toCalchub().expr}'`);

}

function extractDifferentialSymbolNamesFromAnyDifferentialNode(node: IOperatorNode): string[] {
    // only two valid argument node types for the differential function

    // 1) symbol
    // 2) power

    const left = node.left;

    if (!left || isMissingNode(left)) {
        // empty
        return [];
    }

    if (isSymbolFam(left)) {
        return [left.symbol];
    }

    if (isPowerNode(left)) {
        return extractDifferentialSymbolNamesFromPowerNode(left);
    }

    throw new Error(`Invalid differential syntax '${node.toCalchub().expr}'`);
}

function extractDifferentialSymbolNamesFromPowerNode(node: IOperatorNode): string[] {
    const left = node.left;
    const right = node.right;

    let symbols = [];

    // only two valid node types on the left
    // 1) differential
    // 2) symbol

    if (isAnyDifferentialNode(left)) {
        symbols = extractDifferentialSymbolNamesFromAnyDifferentialNode(left);
    }

    if (isSymbolFam(left)) {
        symbols = [left.symbol];
    }

    // if our symbol array is empty or more than one
    // its an error
    if (symbols.length !== 1) {
        throw new Error(`Invalid differential syntax '${node.toCalchub().expr}'`);
    }

    const symbol = symbols[0];

    // now we need to get our power
    if (!isLiteralFam(right)) {
        throw new Error(`Invalid differential power, must be a positive integer.`);
    }

    const powerAsStr = node.right.tokenValue;

    if (!/^(\d)+$/.test(powerAsStr)) {
        throw new Error(`Invalid power '${powerAsStr}'. Must be a positive integer.`);
    }

    const power = parseInt(powerAsStr);
    return fillArray(power, symbol);
}