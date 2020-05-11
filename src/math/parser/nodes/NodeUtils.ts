import {
    ArrayNode,
    CommaNode,
    ConstantNode,
    DerivativeNode,
    FuncDefinitionNode,
    INode,
    IntegralNode,
    IOperatorNode,
    ISymbolNode,
    MatrixNode,
    NodeFamily,
    NodeType,
    ParensNode,
    RootNode,
    TokenName
} from '../../internal';

// By TokenName
// ------------------------

export function isAnyDifferentialNode(node: INode): node is IOperatorNode {
    return node && (node.tokenName === TokenName.Wrt || node.tokenName === TokenName.Pwrt);
}

export function isArrayNode(node: INode): node is ArrayNode {
    return node && node.tokenName === TokenName.Array;
}

export function isAssignment(node: INode): boolean {
    return node && node.tokenName === TokenName.Assign;
}

export function isCurlyParens(node: INode): boolean {
    return node && (node.tokenName === TokenName.LeftCurlyParens || node.tokenName === TokenName.RightCurlyParens);
}

export function isDerivativeNode(node: INode): node is DerivativeNode {
    return node && node.tokenName === TokenName.Derivative;
}

export function isNonCurlyLeftParens(node: INode): boolean {
    return node && node.family === NodeFamily.LeftParens && node.tokenName !== TokenName.LeftCurlyParens;
}

export function isCommaNode(node: INode): node is CommaNode {
    return node && node.tokenName === TokenName.Comma && node instanceof CommaNode;
}

export function isDefineFunctionNode(node: INode): node is FuncDefinitionNode {
    return node && node.tokenName === TokenName.Dfunc;
}

export function isDifferentialNode(node: INode): boolean {
    return node && (node.tokenName === TokenName.Wrt || node.tokenName === TokenName.Pwrt);
}

export function isExponentialConstantNode(node: INode): node is ConstantNode {
    return node && node.tokenName === TokenName.Exp && node instanceof ConstantNode;
}

export function isImplicitMultiNode(node: INode): node is IOperatorNode {
    return node && node.tokenName == TokenName.ImplMultiply;
}

export function isIntegralNode(node: INode): node is IntegralNode {
    return node && node.tokenName == TokenName.Integral;
}

export function isLeftCurlyParenNode(node: INode): node is ParensNode {
    return node && node.tokenName == TokenName.LeftCurlyParens;
}

export function isMatrixNode(node: INode): node is MatrixNode {
    return node && node.tokenName === TokenName.Matrix;
}

export function isMinusSign(node: INode): boolean {
    return node && (node.tokenName === TokenName.Subtract || node.tokenName === TokenName.Negate);
}

export function isMissingNode(node: INode): boolean {
    return node && node.tokenName === TokenName.Missing;
}

export function isPowerNode(node: INode): node is IOperatorNode {
    return node && node.tokenName === TokenName.Power;
}

export function isSymbolNode(node: INode): node is ISymbolNode {
    return node && node.tokenName === TokenName.Symbol;
}

export function isUDFInvocationNode(node: INode): node is IOperatorNode {
    return node && node.tokenName === TokenName.UserDefinedFunc;
}

// By Node type
// -------------------------

export function isOperandType(node: INode): boolean {
    return node && node.type === NodeType.Operand;
}

export function isOperatorType(node: INode): node is IOperatorNode {
    return node && node.type === NodeType.Operator;
}

export function isParensType(node: INode): node is ParensNode {
    return node && node.type === NodeType.Parens;
}

export function isRootNodeType(node: INode): node is RootNode {
    return node && node.type === NodeType.Root;
}

// By Family
// --------------------------

export function isLeftParensFam(node: INode): node is ParensNode {
    return node && node.family === NodeFamily.LeftParens;
}

export function isBinaryOpFam(node: INode): boolean {
    return node && node.family === NodeFamily.BinaryOp;
}

export function isConstantFam(node: INode): boolean {
    return node && node.family === NodeFamily.Constant;
}

export function isFuncFam(node: INode): boolean {
    return node && node.family === NodeFamily.Func;
}

export function isLiteralFam(node: INode): boolean {
    return node && node.family === NodeFamily.Literal;
}

export function isRightParensFam(node: INode): boolean {
    return node && node.family === NodeFamily.RightParens;
}

export function isSymbolFam(node: INode): node is ISymbolNode {
    return node && node.family === NodeFamily.Symbol;
}

export function isUnaryOpFam(node: INode): node is IOperatorNode {
    return node && node.family === NodeFamily.UnaryOp;
}

export function isRightAssocUnaryOp(node: INode): node is IOperatorNode {
    return isUnaryOpFam(node) && node.isRightAssoc;
}

export function isLeftAssocUnaryOp(node: INode): node is IOperatorNode {
    return isUnaryOpFam(node) && node.isLeftAssoc;
}

// Other
// ----------------------------

export function isFuncDefinitionTree(node: INode): node is IOperatorNode {
    return node
        && isAssignment(node)
        && isDefineFunctionNode(node.left)
        && isSymbolFam(node.left.argNodes[0]);
}

export function isVarDefinitionTree(node: INode): boolean {
    return node
        && isAssignment(node)
        && isSymbolFam(node.left);
}

export function walkTree(node: INode, iterator: (node: INode) => void) {
    iterator(node);
    node.children.forEach(child => walkTree(child, iterator));
}

export function getUniqueAnySymbolNodes(tree: INode): ISymbolNode[] {
    if (tree == null) {
        return [];
    }

    const nodes: { [symbol: string]: ISymbolNode } = {};

    walkTree(tree, node => {
        if (isSymbolFam(node)) {
            nodes[node.symbol] = node;
        }
    });

    return Object.values(nodes);
}

export function getUniqueNonLocalSymbolNodes(tree: INode): ISymbolNode[] {
    if (tree == null) {
        return [];
    }

    const nodes: { [symbol: string]: ISymbolNode } = {};

    walkTree(tree, node => {
        if (isSymbolFam(node) && !node.isLocal) {
            nodes[node.symbol] = node;
        }
    });

    return Object.values(nodes);
}

export function getUniqueUdfInvocationNodes(tree: INode): IOperatorNode[] {
    if (tree == null) {
        return [];
    }

    const nodes: { [fnName: string]: IOperatorNode } = {};

    walkTree(tree, node => {
        if (isUDFInvocationNode(node)) {
            nodes[node.tokenValue] = node as IOperatorNode;
        }
    });

    return Object.values(nodes);
}
