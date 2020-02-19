import { action, computed, observable } from 'mobx';
import { TrigMode } from '../internal';

export class MathContextSettingsProps {
    trigMode?: TrigMode;
}

export class MathContextSettings {
    @observable private _trigMode: TrigMode;

    constructor(props?: Partial<MathContextSettingsProps>) {
        props = props || {};
        this._trigMode = props.trigMode || TrigMode.Radians;
    }

    @computed
    get trigMode(): TrigMode {
        return this._trigMode;
    }

    @action
    applySettings(settings?: MathContextSettingsProps) {
        settings = settings || {};
        this.setTrigMode(settings.trigMode)
    }

    @action
    setTrigMode(mode: TrigMode) {
        if (mode == null) {
            return;
        }

        this._trigMode = mode;
    }

    toJS(): MathContextSettingsProps {
        return {
            trigMode: this.trigMode,
        }
    }
}
