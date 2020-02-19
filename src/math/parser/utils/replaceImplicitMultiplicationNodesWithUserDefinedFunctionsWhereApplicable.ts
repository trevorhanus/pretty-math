import { buildNode, INode, isImplicitMultiNode, isSymbolFam, Token, TokenName } from '../../internal';

/**
 * 2 situations
 *
 * 1) f(x) = 2x
 * 2) y + f(5)
 *
 * First case 'f' should be treated as a symbol since it is the
 * identifier for a function.
 *
 * Second case 'f' should be treated as a function since it
 * represents a function invocation & it is externally defined
 *
 * How do we know to treat 'f' differently?
 *
 * Create the Math Tree treating all words as symbols, then
 * re-walk the tree and replace implicit multiplication nodes
 * with function invocations where applicable.
 *
 */
export function replaceImplicitMultiNodesWithUserDefinedFunctionsWhereApplicable(node: INode, fnMap: { [fnName: string]: true }): INode {
    if (isImplicitMultiNode(node)) {
        // is the left a non-local symbol node with the tokenValue of a external function?
        const left = node.left;

        if (isSymbolFam(left) && !left.isLocal && fnMap[left.symbol]) {
            // replace implicit operator with
            // function operator
            const oldToken = left.token;
            const token = new Token(TokenName.UserDefinedFunc, oldToken.value, oldToken.start);
            const newNode = buildNode(token);
            newNode.setLocalSymbols(node.localSymbols);
            newNode.addChild(replaceImplicitMultiNodesWithUserDefinedFunctionsWhereApplicable(node.right, fnMap));
            return newNode;
        }
    }

    // else just clone it
    const clone = node.clone();
    clone.setLocalSymbols(node.localSymbols);

    node.children.forEach(child => {
        clone.addChild(replaceImplicitMultiNodesWithUserDefinedFunctionsWhereApplicable(child, fnMap));
    });

    return clone;
}
