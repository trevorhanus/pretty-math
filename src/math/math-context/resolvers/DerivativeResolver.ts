import {
    canUseDOM,
    DerivativeNode,
    DerivativeRequestBody,
    doDerivative,
    getPythonSafeSymbol,
    getSymbolForPythonSafeSymbol,
    getUniqueAnySymbolNodes,
    INode,
    isSymbolFam,
    markLocalSymbols,
    parsePython,
    ResolvedCallback,
    resolveTree,
    ResolveTreeOpts
} from '../../internal';

export function resolveDerivative(node: DerivativeNode, opts: ResolveTreeOpts, cb: ResolvedCallback) {
    if (!canUseDOM) {
        // on serverside
        return cb(null, node);
    }

    const localSymbolsAbove = node.parent ? { ...node.parent.localSymbols } : {};

    resolveTree(node.expression, { cxt: opts.cxt }, (err, resolvedExpr) => {
        if (err) {
            return cb(err);
        }

        const differentials = node.differentialsAsSymbolNames;
        const pythonSafeDifferentials = differentials.map(d => getPythonSafeSymbol(d));

        const reqBody: DerivativeRequestBody = {
            expr: resolvedExpr.toPython().expr,
            operation: 'derivative',
            variables: getUniqueAnySymbolNodes(node).map(s => s.pythonSafeSymbol),
            wrt: pythonSafeDifferentials,
        };

        doDerivative(reqBody, (err, res) => {
            if (err) {
                return cb(err);
            }

            const parseResult = parsePython(res.resultAsPython);

            if (parseResult.error) {
                return cb(parseResult.error);
            }

            if (!parseResult.root.only) {
                return cb(new Error('Error parsing result from symserver.'));
            }

            const rawResult = replacePythonSafeSymbolNodesWithSymbols(parseResult.root.only);

            // the rawResult is the raw result from the server
            // x^2 => 2x
            // local symbols will not have been marked
            // so we need to apply the localSymbols from above
            markLocalSymbols(rawResult, localSymbolsAbove);

            // now we need to resolve the rawResult
            resolveTree(rawResult, opts, (err, resolved) => {
                if (err) {
                    return cb(err);
                }

                cb(null, resolved);
            });
        });
    });
}

export function replacePythonSafeSymbolNodesWithSymbols(tree: INode): INode {
    // first do the children
    const newChildren = tree.children.map(child => replacePythonSafeSymbolNodesWithSymbols(child));

    let newNode = tree.clone();

    if (isSymbolFam(tree)) {
        const sym = getSymbolForPythonSafeSymbol(tree.symbol);
        if (sym) {
            newNode = tree.cloneWithNewSymbol(sym);
        }
    }

    newChildren.forEach(child => {
        newNode.addChild(child);
    });

    return newNode;
}
