import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Store } from './Store';

export interface IContextSwitcherProps {
    store?: Store;
}

export const ContextSwitcher = inject('store')(observer((props: IContextSwitcherProps) => {
    const { store } = props;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        store.activateContext(val);
    };

    const handleNewContext = () => {
        const name = prompt('Context name:');
        store.activateBlankContext(name);
    };

    const handleRename = () => {
        const newName = prompt('New name:');
        store.renameActiveContext(newName);
    };

    return (
        <div className="p-4 flex items-center">

            <div className="inline">
                <label>Context: </label>
                <select
                    value={store.activeContextName}
                    onChange={handleChange}
                >
                    <option value="">-</option>
                    {
                        Array.from(store.savedContexts.values()).map(context => {
                            return <option key={context.name} value={context.name}>{context.name}</option>;
                        })
                    }

                </select>
            </div>

            <div className="ml-auto">
                <span
                    className="p-2 cursor-pointer rounded border mr-2 text-sm"
                    onClick={handleRename}
                >
                    Rename
                </span>

                <span
                    className="p-2 cursor-pointer rounded border mr-2 text-sm"
                    onClick={handleNewContext}
                >
                    New Context
                </span>
            </div>

        </div>
    );
}));
