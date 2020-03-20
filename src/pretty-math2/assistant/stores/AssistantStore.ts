import { action, computed, observable } from 'mobx';

export enum AssistantForce {
    Open,
    Closed,
}

export class AssistantStore {
    @observable _force: AssistantForce;

    constructor() {
        this._force = null;
    }

    @computed
    get force(): AssistantForce {
        return this._force;
    }

    @action
    forceOpen() {
        this._force = AssistantForce.Open;
    }

    @action
    forceClosed() {
        this._force = AssistantForce.Closed;
    }

    @action
    releaseForce() {
        this._force = null;
    }
}
