import {
    Change,
    ChangeEvent,
    ChangeType,
    DefineFnEvent,
    DefineVarEvent,
    DeleteFnEvent,
    DeleteVarEvent,
    EventType,
    MathContext,
    MathExpr,
    MathExprProps
} from '../internal';

export class EventEmitter {
    private _mathCxt: MathContext;

    constructor(mathCxt: MathContext) {
        this._mathCxt = mathCxt;
        this._mathCxt.bus.addListener(EventType.Change, this.handleChangeEvent);
    }

    handleChangeEvent = (e: ChangeEvent) => {
        const { changeSet } = e;
        if (changeSet == null) {
            return;
        }

        changeSet.forEach(change => {
            this.interpretChange(change);
        });
    };

    interpretChange = (e: Change) => {
        const { oldProps, newProps, id } = e;
        let expr: MathExpr;

        switch (e.type) {

            case ChangeType.ExprInsert:
                expr = this._mathCxt.getExprById(e.id);

                if (expr.isVariable) {
                    const e = this.buildDefineVarEvent(newProps, expr.symbol, id);
                    this._mathCxt.bus.dispatch(EventType.DefineVar, e);
                }

                if (expr.isFunctionDefinition) {
                    const e = this.buildDefineFnEvent(newProps, expr.funcName, id);
                    this._mathCxt.bus.dispatch(EventType.DefineFn, e);
                }

                break;

            case ChangeType.ExprUpdate:
                this.interpretExprUpdate(e);
                break;

            case ChangeType.ExprDelete:
                expr = MathExpr.fromProps({ expr: oldProps.expr });

                if (expr.isVariable) {
                    const e = this.buildDeleteVarEvent(oldProps, expr.symbol, id);
                    this._mathCxt.bus.dispatch(EventType.DeleteVar, e);
                }

                if (expr.isFunctionDefinition) {
                    const e = this.buildDeleteFnEvent(oldProps, expr.funcName, id);
                    this._mathCxt.bus.dispatch(EventType.DeleteFn, e);
                }

                break;
        }
    };

    private interpretExprUpdate(e: Change) {
        // the expr has been updated so we have an oldExpr and a newExpr
        // we need to decide if the expr has changed it's definition

        const { id, newProps, oldProps } = e;

        if (oldProps.expr === newProps.expr) {
            // expr did not change
            return;
        }

        const oldExpr = MathExpr.fromProps({ expr: oldProps.expr });
        const newExpr = MathExpr.fromProps({ expr: newProps.expr });

        // use ternary system
        const ones = (oldExpr.isFunctionDefinition ? 2 : oldExpr.isVariable ? 1 : 0);
        const threes = (newExpr.isFunctionDefinition ? 2 : newExpr.isVariable ? 1 : 0);
        const orientation = ones + (threes * 3);

        let deleteEvt = null;
        let defineEvt = null;

        switch (orientation) {
            // old nothing, new nothing
            case 0:
                break;

            // old var, new nothing
            case 1:
                deleteEvt = this.buildDeleteVarEvent(oldProps, oldExpr.symbol, id);
                break;

            // old fn, new nothing
            case 2:
                deleteEvt = this.buildDeleteFnEvent(oldProps, oldExpr.funcName, id);
                break;

            // old nothing, new var
            case 3:
                defineEvt = this.buildDefineVarEvent(newProps, newExpr.symbol, id);
                break;

            // old var, new var
            case 4:
                if (oldExpr.symbol !== newExpr.symbol) {
                    deleteEvt = this.buildDeleteVarEvent(oldProps, oldExpr.symbol, id);
                    defineEvt = this.buildDefineVarEvent(newProps, newExpr.symbol, id);
                }
                break;

            // old fn, new var
            case 5:
                deleteEvt = this.buildDeleteFnEvent(oldProps, oldExpr.funcName, id);
                defineEvt = this.buildDefineVarEvent(newProps, newExpr.symbol, id);
                break;

            // old nothing, new fn
            case 6:
                defineEvt = this.buildDefineFnEvent(newProps, newExpr.funcName, id);
                break;

            // old var, new fn
            case 7:
                deleteEvt = this.buildDeleteVarEvent(oldProps, oldExpr.symbol, id);
                defineEvt = this.buildDefineFnEvent(newProps, newExpr.funcName, id);
                break;

            // old fn, new fn
            case 8:
                if (oldExpr.funcName !== newExpr.funcName) {
                    deleteEvt =  this.buildDeleteFnEvent(oldProps, oldExpr.funcName, id);
                    defineEvt = this.buildDefineFnEvent(newProps, newExpr.funcName, id);
                }
                break;
        }

        if (deleteEvt) {
            this._mathCxt.bus.dispatch(deleteEvt.type, deleteEvt);
        }

        if (defineEvt) {
            this._mathCxt.bus.dispatch(defineEvt.type, defineEvt);
        }
    }

    private buildDefineFnEvent(newProps: MathExprProps, funcName: string, exprId: string): DefineFnEvent {
        return {
            type: EventType.DefineFn,
            exprId,
            funcName,
            props: newProps,
        };
    }

    private buildDefineVarEvent(newProps: MathExprProps, symbol: string, exprId: string): DefineVarEvent {
        return {
            type: EventType.DefineVar,
            exprId,
            symbol,
            props: newProps,
        };
    }

    private buildDeleteFnEvent(oldProps: MathExprProps, funcName: string, exprId: string): DeleteFnEvent {
        return {
            type: EventType.DeleteFn,
            exprId,
            funcName,
            props: oldProps,
        };
    }

    private buildDeleteVarEvent(oldProps: MathExprProps, symbol: string, exprId: string): DeleteVarEvent {
        return {
            type: EventType.DeleteVar,
            exprId,
            symbol,
            props: oldProps,
        };
    }
}
