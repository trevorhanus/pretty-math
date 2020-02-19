import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { TrigMode } from 'math';
import { Store } from './Store';

export interface IHeaderProps {
    store?: Store;
}

export const Header = inject('store')(observer((props: IHeaderProps) => {

    const handleCopyState = () => {
        copyToClipboard(JSON.stringify(props.store.toJS(), null, 2));
    };

    return (
        <div className="w-full h-full flex items-center bg-gray-100 border-b px-4">
            <h1>CalcHub Tree Explorer</h1>
            <div
                className="ml-auto"

            >
                <TrigModeSwitcher
                    className="mr-2 text-sm"
                />
                <span
                    className="p-2 cursor-pointer rounded border text-sm"
                    onClick={handleCopyState}
                >
                    Copy State
                </span>
            </div>
        </div>
    );
}));

export interface ITrigModeSwitcherProps {
    className?: string;
    store?: Store;
}

export const TrigModeSwitcher = inject('store')(observer((props: ITrigModeSwitcherProps) => {
    const { store } = props;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        store.mathCxt.settings.setTrigMode(val as TrigMode);
    };

    return (
        <select
            className={props.className}
            value={store.mathCxt.settings.trigMode}
            onChange={handleChange}
        >
            <option value="radians">Radians</option>
            <option value="degrees">Degrees</option>
        </select>
    );
}));

export function copyToClipboard(str: string) {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}
