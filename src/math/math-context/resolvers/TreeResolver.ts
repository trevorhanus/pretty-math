import {
    INode,
    IOperatorNode,
    isAssignment,
    isDefineFunctionNode,
    isDerivativeNode,
    isIntegralNode,
    isSymbolFam,
    isUDFInvocationNode,
    MathContext,
    resolveDerivative,
    resolveIntegral
} from '../../internal';

export interface ResolveTreeOpts {
    cxt?: MathContext;
    localScope?: LocalScope;
    assignmentSymbol?: string;
}

export type LocalScope = { [symbol: string]: INode };
export type ResolvedCallback = (err: any, tree?: INode) => void;

export function resolveTreeSync(tree: INode, opts: ResolveTreeOpts): INode {
    let resolved: INode = null;
    resolveTree(tree, opts, (err, r) => {
        resolved = r;
    });
    return resolved;
}

export function resolveTree(tree: INode, opts: ResolveTreeOpts, cb: ResolvedCallback) {
    try {
        const localScope = { ...opts.localScope };
        const { cxt, assignmentSymbol } = opts;

        if (tree == null) {
            return cb(null, null);
        }

        if (isAssignment(tree)) {
            // need to set the assignmentSymbol
            // so we can detect circular dependencies

            let assignmentSymbol = null;

            if (isSymbolFam(tree.left)) {
                assignmentSymbol = tree.left.symbol;
            }

            if (isDefineFunctionNode(tree.left)) {
                assignmentSymbol = tree.left.fnName;
            }

            const newOpts = {
                ...opts,
                assignmentSymbol,
            };

            // never resolve the left side of
            // an assignment node, so just resolve the right

            return resolveTree(tree.right, newOpts, (err, resolved) => {
                if (err) {
                    return cb(err);
                }

                const root = tree.clone();
                const left = tree.left.cloneDeep();
                root.addChild(left);
                root.addChild(resolved);
                cb(null, root);
            });
        }

        if (isDerivativeNode(tree)) {
            return resolveDerivative(tree, opts, (err, result) => {
                if (err) {
                    cb(err);
                } else {
                    cb(null, result)
                }
            });
        }

        if (isIntegralNode(tree)) {
            return resolveIntegral(tree, opts, (err, result) => {
                if (err) {
                    cb(err);
                } else {
                    cb(null, result);
                }
            });
        }

        // we resolve a tree depth-first
        // so we always resolve our children first

        resolveTrees(tree.children, opts, (err, resolvedChildren) => {
            if (err) {
                return cb(err);
            }

            // now we need to resolve our node
            let node = tree;

            if (isSymbolFam(node) && localScope[node.symbol] !== undefined) {
                // replace with the node from the localScope
                const dep = localScope[node.symbol];
                return cb(null, dep !== null ? dep.cloneDeep() : node.clone());
            }

            if (isSymbolFam(node) && node.isLocal) {
                // a local symbol means we don't
                // do any replacements
                return cb(null, node.clone());
            }

            if (isSymbolFam(node) && cxt) {
                const symbol = node.symbol;

                const expr = cxt.getVar(symbol);

                if (!expr) {
                    // variable is not defined in the context right now
                    // just resolve with a new symbol node
                    return cb(null, node.clone());
                }

                if (expr.hasError) {
                    return cb(expr.error);
                }

                // check for circular dependencies
                let circularDep = expr.uniqueNonLocalSymbolNodes.some(node => {
                    return node.symbol === assignmentSymbol;
                });

                if (!circularDep) {
                    // maybe we have a user defined function invocation
                    circularDep = expr.uniqueUdfNodes.some(node => {
                        return node.tokenValue === assignmentSymbol;
                    });
                }

                if (circularDep) {
                    return cb(new Error('Circular dependency found.'));
                }

                // else we get the expressions deepTree
                return expr.resolver.resolveDeepTree((err, deepTree) => {
                    if (err) {
                        return cb(err);
                    }

                    if (!deepTree) {
                        return cb(null, null);
                    }

                    const formulaRoot = getFormulaRoot(deepTree);

                    if (!formulaRoot) {
                        return cb(null, null);
                    }

                    cb(null, formulaRoot.cloneDeep());
                });
            }

            if (isUDFInvocationNode(node) && cxt) {
                // invoking a user defined function
                // need to find the function in the context
                const fnName = node.tokenValue;
                const funcExpr = cxt.getFunc(fnName);

                if (!funcExpr) {
                    // can't find the function?
                    // this shouldn't ever happen
                    return cb(new Error(`Could not find user defined function '${fnName}'`));
                }

                if (funcExpr.error) {
                    return cb(funcExpr.error);
                }

                // get functions deepTree
                return funcExpr.resolver.resolveDeepTree((err, deepTree) => {
                    if (err) {
                        return cb(err);
                    }

                    const formulaTree = getFormulaRoot(deepTree);

                    // now we need to resolve the functions arguments
                    resolveTrees((node as IOperatorNode).argNodes, { cxt }, (err, resolvedTrees) => {
                        if (err) {
                            return cb(err);
                        }

                        // now build our localScope
                        const localScope = {};
                        funcExpr.funcDefinitionLocalSymbolNames.forEach((varName, i) => {
                            localScope[varName] = resolvedTrees[i] || null;
                        });

                        // finally
                        resolveTree(formulaTree, { cxt, localScope }, (err, resolved) => {
                            if (err) {
                                return cb(err);
                            }
                            cb(null, resolved);
                        });
                    });
                });
            }

            // otherwise, must be an operator or something
            const clone = node.clone();

            resolvedChildren.forEach(child => {
                clone.addChild(child);
            });

            cb(null, clone);
        });
    } catch (e) {
        cb(e);
    }
}

export type TreeListResolvedCallback = (err: any, trees?: INode[]) => void;

export function resolveTrees(trees: INode[], opts: ResolveTreeOpts, cb: TreeListResolvedCallback) {
    if (trees == null || trees.length === 0) {
        return cb(null, []);
    }

    let oneDidError = false;
    const resolvedTrees = [];

    trees.forEach((tree, i) => {
        resolveTree(tree, opts, (err, resolved) => {
            if (oneDidError) {
                // someone else errored already,
                // so just return
                return;
            }

            if (err) {
                oneDidError = true;
                return cb(err);
            }

            resolvedTrees[i] = resolved;

            const allResolved = firstUndefinedIndex(resolvedTrees) >= trees.length;

            if (allResolved) {
                cb(null, resolvedTrees);
            }
        });
    });
}

function firstUndefinedIndex(arr: any[]): number {
    let i = 0;
    while (true) {
        if (arr[i] === undefined) {
            return i;
        }
        i++;
    }
}

export function getFormulaRoot(tree: INode): INode {
    if (isAssignment(tree)) {
        return tree.right;
    }

    return tree;
}
