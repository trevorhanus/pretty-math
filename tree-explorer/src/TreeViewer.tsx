import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Store } from './Store';

export interface ITreeViewerProps {
    store?: Store;
}

export const TreeViewer = inject('store')(observer((props: ITreeViewerProps) => {
    const { store } = props;
    const expr = store.activeExpr;

    if (!expr) {
        return null;
    }

    const renderShallowTree = () => {
        let obj = {};

        if (expr.shallowTree) {
            obj = expr.shallowTree.toShorthand();
        }

        return (
            <div className="p-4">
                <pre>
                    {JSON.stringify(obj, null, 2)}
                </pre>
            </div>
        );
    };

    const renderDeepTree = () => {
        let obj = {};

        if (expr.resolver.deepTree) {
            obj = expr.resolver.deepTree.toShorthand();
        }

        return (
            <div className="p-4">
                <pre>
                    {JSON.stringify(obj, null, 2)}
                </pre>
            </div>
        );
    };

    const renderSimplifiedTree = () => {
        let obj = {};

        if (expr.resolver.simplifiedDeepFormulaTree) {
            obj = expr.resolver.simplifiedDeepFormulaTree.toShorthand();
        }

        return (
            <div className="p-4">
                <pre>
                    {JSON.stringify(obj, null, 2)}
                </pre>
            </div>
        );
    };

    const renderError = () => {
        const error = expr.error;

        if (!error) {
            return null;
        }

        const message = error ? error.message : 'no error';

        return (
            <div className="bg-red-200 p-4">
                <div>Error: {message}</div>
            </div>
        );
    };

    const renderTabContent = () => {
        const { tab } = store;

        switch (tab) {
            case 'shallow_tree':
                return renderShallowTree();

            case 'deep_tree':
                return renderDeepTree();

            case 'simplified_tree':
                return renderSimplifiedTree();

            default:
                return renderDeepTree();

        }
    };

    return (
        <div className="flex flex-col h-full">
            <Tabs />
            <div className="flex-grow bg-yellow-100">
                {renderError()}
                <div className="h-full w-full overflow-y-scroll">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
}));

export interface ITabsProps {
    store?: Store;
}

export const Tabs = inject('store')(observer((props: ITabsProps) => {
    return (
        <ul className="flex border-b">
            <Tab tab="shallow_tree" />
            <Tab tab="deep_tree" />
            <Tab tab="simplified_tree" />
        </ul>
    );
}));

export interface ITabProps {
    tab: string;
    store?: Store;
}

export const Tab = inject('store')(observer((props: ITabProps) => {

    const className = classNames(
        'tab',
        'py-2 px-4',
        'cursor-pointer',
        'border-r',
        'hover:bg-green-100',
        'relative',
        { 'active-tab': props.store.tab === props.tab },
    );

    const handleClick = () => {
        props.store.tab = props.tab;
    };

    const label = {
        'shallow_tree': 'Shallow Tree',
        'deep_tree': 'Deep Tree',
        'simplified_tree': 'Simplified'
    };

    return (
        <li
            className={className}
            onClick={handleClick}
        >
            { label[props.tab] }
        </li>
    );
}));
