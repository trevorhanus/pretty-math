import { observer, Provider } from 'mobx-react';
import * as React from 'react';
import { ContextSwitcher } from './ContextSwitcher';
import { InputEditor } from './InputEditor';
import { Store } from './Store';
import { TreeViewer } from './TreeViewer';
import { Header } from './Header';
import * as SavedState from './state.json';

export interface IAppProps {
}

@observer
export class App extends React.Component<IAppProps, {}> {
    store: Store;

    constructor(props: IAppProps) {
        super(props);
        this.store = new Store(SavedState as any);
    }

    render() {
        return (
            <Provider store={this.store}>
                <div className="fixed inset-0 flex flex-col">
                    <div className="w-full h-12">
                        <Header />
                    </div>
                    <div className="flex-grow w-full flex">
                        <div className="w-1/2 border-r">
                            <ContextSwitcher />
                            <InputEditor />
                        </div>
                        <div className="w-1/2">
                            <TreeViewer />
                        </div>
                    </div>
                </div>
            </Provider>
        );
    }

}
