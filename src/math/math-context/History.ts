import { reaction } from 'mobx';
import { buildChangeSet, EventType, MathContext, MathContextProps } from '../internal';

export class History {
    private _disposeReaction: () => void;
    private _mathCxt: MathContext;
    private _lastCxtState: MathContextProps;

    constructor(mathCxt: MathContext) {
        this._mathCxt = mathCxt;
        this._lastCxtState = mathCxt.toJS();
        this.setupReaction();
    }

    private handleStateChange(newProps: MathContextProps) {
        const lastState = this._lastCxtState;
        this._lastCxtState = newProps;

        const changeSet = buildChangeSet(lastState, newProps);

        if (changeSet.length === 0) {
            // no changes
            return;
        }

        this._mathCxt.bus.dispatch(EventType.Change, { changeSet });
    }

    private setupReaction() {
        if (this._disposeReaction) {
            this._disposeReaction();
        }

        this._disposeReaction = reaction(
            () => this._mathCxt.toJS(),
            (newProps: MathContextProps) => {
                this.handleStateChange(newProps);
            }
        );
    }
}
