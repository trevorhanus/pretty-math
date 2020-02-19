export type EventListener = (event?: any) => void;
export type RemoveFn = () => void;

export class EventBus {
    private _listenersMap: Map<string, EventListener[]>;
    private _doLog: boolean;

    constructor() {
        this._listenersMap = new Map<string, EventListener[]>();
        this._doLog = false;
    }

    addListener(eventName: string, listener: EventListener): RemoveFn {
        const listeners = this.getListeners(eventName);
        listeners.push(listener);
        return this.removeListener.bind(this, eventName, listener);
    }

    dispatch(eventName: string, event?: any) {
        event = event != null ? event : {};
        event.type = event.type || eventName;

        if (this._doLog) {
            console.log(event);
        }

        const listeners = this.getListeners(eventName);
        listeners.forEach(listener => {
            listener(event);
        });
    }

    debug(): boolean {
        this._doLog = !this._doLog;
        return this._doLog;
    }

    removeListener(eventName: string, listener: EventListener) {
        const listeners = this.getListeners(eventName);
        const index = listeners.findIndex(l => l === listener);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    }

    getListeners(eventName: string): EventListener[] {
        if (!this._listenersMap.has(eventName)) {
            this._listenersMap.set(eventName, []);
        }

        return this._listenersMap.get(eventName);
    }
}
