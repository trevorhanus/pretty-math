import {
    canUseDOM,
    doIntegral,
    getUniqueAnySymbolNodes,
    IntegralNode,
    IntegralRequestBody,
    markLocalSymbols,
    parsePython,
    replacePythonSafeSymbolNodesWithSymbols,
    ResolvedCallback,
    resolveTree,
    ResolveTreeOpts
} from '../../internal';

export function resolveIntegral(node: IntegralNode, opts: ResolveTreeOpts, cb: ResolvedCallback) {
    if (!canUseDOM) {
        // on serverside
        return cb(null, node);
    }

    const localSymbolsAbove = node.parent ? { ...node.parent.localSymbols } : {};

    resolveTree(node.expression, { cxt: opts.cxt }, (err, resolvedExpr) => {
        if (err) {
            return cb(err);
        }

        const pythonSafeDifferential = node.wrt.toPython().expr;
        const pythonSafeLeftBound = node.leftBound && node.leftBound.toPython().expr;
        const pythonSafeRightBound = node.rightBound && node.rightBound.toPython().expr;

        const reqBody: IntegralRequestBody = {
            operation: 'integral',
            expr: resolvedExpr.toPython().expr,
            wrt: pythonSafeDifferential,
            leftBound: pythonSafeLeftBound,
            rightBound: pythonSafeRightBound,
            variables: getUniqueAnySymbolNodes(node).map(s => s.pythonSafeSymbol),
        };

        doIntegral(reqBody, (err, res) => {
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
