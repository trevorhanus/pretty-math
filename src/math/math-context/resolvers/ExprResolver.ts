import Decimal from 'decimal.js';
import { action, computed, observable, reaction } from 'mobx';
import {
    getFormulaRoot,
    INode,
    MathContext,
    MathExpr,
    parseCalchub,
    ResolvedCallback,
    resolveTree,
    SimplifyNodeOpts,
    TrigMode
} from '../../internal';

export class ExprResolver {
    readonly expr: MathExpr;
    @observable.ref private _deepTree: INode;
    @observable.ref private _error: any;
    @observable private _isResolving: boolean;
    private _onResolvedCbs: ResolvedCallback[];
    private _version: number;

    constructor(mathExpr: MathExpr) {
        this.expr = mathExpr;
        this._deepTree = null;
        this._error = null;
        this._onResolvedCbs = [];
        this._version = 1;
    }

    init() {
        reaction(
            () => {
                // whenever my MathExpr's expr changes
                // or the deepTree of any of my immediate refs
                // then we need to re-resolve the deepTree

                return {
                    expr: this.expr.expr,
                    deepTrees: this.expr.immediateRefs.map(expr => expr.resolver.deepTree),
                    cxt: this.expr.mathCxt,
                };
            },
            ({ expr }) => {
                this._version = this._version + 1;
                this._error = null;
                this._deepTree = null;

                if (this.expr.error) {
                    return;
                }

                if (!expr) {
                    return;
                }

                const fnNames = this.mathCxt ? this.mathCxt.fnNames : [];
                const parseResult = parseCalchub(expr, fnNames);

                if (parseResult.error) {
                    this._error = parseResult.error;
                    this._invokeCbs();
                    return;
                }

                const shallowTree = parseResult.root.only;

                if (!shallowTree) {
                    this._error = { message: 'Syntax error.' };
                    this._invokeCbs();
                    return;
                }

                this._isResolving = true;
                const runVersion = this._version;

                resolveTree(shallowTree, { cxt: this.mathCxt }, action((err, resolved) => {
                    if (this._version > runVersion) {
                        // a newer version came in while we were
                        // resolving the tree, so we'll just return
                        // and let the newer resolver take precedence
                        return;
                    }

                    if (!err) {
                        try {
                            resolved.simplify();
                        } catch (e) {
                            err = e;
                        }
                    }

                    this._error = err;
                    this._deepTree = resolved;
                    this._isResolving = false;
                    this._invokeCbs();
                }));
            },
            {
                name: 'ExprResolver Reaction',
                fireImmediately: true,
                equals: (o, n) => {
                    // console.log('old: ', o);
                    // console.log('new: ', n);
                    return o.expr === n.expr && arraysEqual(o.deepTrees, n.deepTrees) && n.cxt === o.cxt;
                }
            }
        );
    }

    @computed
    get decimal(): Decimal {
        return this.simplifiedDeepFormulaTree ? this.simplifiedDeepFormulaTree.decimal : null;
    }

    @computed
    get deepTree(): INode {
        return this._deepTree;
    }

    @computed
    get deepFormulaTree(): INode {
        return getFormulaRoot(this._deepTree);
    }

    @computed
    get error(): Error {
        return this._error;
    }

    @computed
    get isResolving(): boolean {
        return this._isResolving;
    }

    @computed
    get mathCxt(): MathContext {
        return this.expr.mathCxt;
    }

    @computed
    get primitiveNumber(): number {
        return this.simplifiedDeepFormulaTree ? this.simplifiedDeepFormulaTree.primitiveNumber : NaN;
    }

    @computed
    get shallowTree(): INode {
        return this.expr.shallowTree;
    }

    @computed
    get simplifiedDeepFormulaTree(): INode {
        if (!this.deepFormulaTree) {
            return null;
        }

        try {
            const simplifyOpts: SimplifyNodeOpts = {
                trigMode: this.mathCxt ? this.mathCxt.settings.trigMode : TrigMode.Radians,
            };

            return this.deepFormulaTree.simplify(simplifyOpts);
        } catch (e) {
            return null;
        }
    }

    resolveDeepTree(cb: (err: any, deepTree: INode) => void) {
        if (this._isResolving) {
            this._onResolvedCbs.push(cb);
            return;
        }

        cb(this.error, this.deepTree);
    }

    private _invokeCbs() {
        while (this._onResolvedCbs.length > 0) {
            const cb = this._onResolvedCbs.pop();
            cb(this._error, this._deepTree);
        }
    }
}

function arraysEqual(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) {
        return false;
    }

    let areEqual = true;
    arr1.forEach((item1, i) => {
        const item2 = arr2[i];
        if (item1 !== item2) {
            areEqual = false;
        }
    });

    return areEqual;
}
