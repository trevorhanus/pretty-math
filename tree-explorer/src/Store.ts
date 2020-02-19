import { MathContext, MathContextProps, MathExpr, TrigMode } from 'math';
import { action, computed, observable, ObservableMap, reaction } from 'mobx';

export interface SavedState {
    activeContextName: string;
    activeExprId: string;
    contexts: SavedContext[];
    tab: string;
    trigMode: TrigMode;
}

export interface SavedContext {
    name: string;
    js: MathContextProps;
}

export class Store {
    @observable _activeContextName: string;
    @observable _activeExprId: string;
    @observable tab: string;
    @observable.ref mathCxt: MathContext;
    savedContexts: ObservableMap<SavedContext>;

    constructor(state: SavedState) {
        this._activeContextName = '';
        this.mathCxt = new MathContext();
        this.mathCxt.addExpr(MathExpr.fromExpr('x=10'));
        this.tab = 'shallow_tree';
        this.savedContexts = observable.map();
        state = getSavedState() || state;
        this.applySavedState(state);
        reaction(
            () => this.toJS(),
            (state) => saveState(state),
        );
        reaction(
            () => this.mathCxt.toJS(),
            (state) => {
                this.savedContexts.set(this.activeContextName, { name: this.activeContextName, js: state });
            }
        );
    }

    @computed
    get activeContextName(): string {
        return this._activeContextName;
    }

    @computed
    get activeExpr(): MathExpr {
        return this.mathCxt.getExprById(this._activeExprId) || this.mathCxt.exprs[0];
    }

    @action
    activateBlankContext(name: string) {
        if (!name) {
            return alert(`A name is required.`);
        }

        if (this.savedContexts.has(name)) {
            return alert(`${name} already exists.`);
        }

        const mathCxt = new MathContext();
        mathCxt.addExpr(MathExpr.fromExpr(''));

        this.savedContexts.set(name, { name, js: mathCxt.toJS() });
        this.activateContext(name);
    }

    @action
    activateContext(name: string) {
        const context = this.savedContexts.get(name);
        if (context) {
            window.localStorage.setItem('last_context', name);
            this._activeContextName = name;
            this.mathCxt = MathContext.fromJS(context.js);
            this._activeExprId = null;
        }
    }

    @action
    addExpr = () => {
        const expr = MathExpr.fromExpr('');
        this.mathCxt.addExpr(expr);
        this._activeExprId = expr.id;
    };

    @action
    applySavedState(state: SavedState) {
        state.contexts.forEach(savedContext => {
            this.savedContexts.set(savedContext.name, savedContext);
        });

        this.activateContext(state.activeContextName);

        if (state.trigMode) {
            this.mathCxt.settings.setTrigMode(state.trigMode);
        }

        if (state.activeExprId) {
            this._activeExprId = state.activeExprId;
        }

        if (state.tab) {
            this.tab = state.tab;
        }
    }

    @action
    renameActiveContext(newName: string) {
        if (!newName) {
            return alert(`A name is required.`);
        }

        if (this.savedContexts.has(newName)) {
            return alert(`${name} already exists.`);
        }

        const oldName = this.activeContextName;
        const context = this.savedContexts.get(oldName);
        context.name = newName;
        this.savedContexts.delete(oldName);
        this.savedContexts.set(newName, context);
        this.activateContext(newName);
    }

    @action
    setActiveExpr = (id: string) => {
        this._activeExprId = id;
    };

    toJS(): SavedState {
        return {
            activeContextName: this.activeContextName,
            activeExprId: this._activeExprId,
            contexts: Array.from(this.savedContexts.values()),
            tab: this.tab,
            trigMode: this.mathCxt.settings.trigMode,
        }
    }
}

function getSavedState(): SavedState {
    const s = window.localStorage.getItem('saved_state');
    return s ? JSON.parse(s) : null;
}

function saveState(state: SavedState) {
    window.localStorage.setItem('saved_state', JSON.stringify(state));
}
