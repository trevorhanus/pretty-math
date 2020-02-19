import { observer, Provider } from 'mobx-react';
import * as React from 'react';
import { MathField } from 'pretty-math/components';

export interface IAppProps {
}

@observer
export class App extends React.Component<IAppProps, {}> {

    constructor(props: IAppProps) {
        super(props);
    }

    render() {
        return (
            <Provider>
                <div className="fixed inset-0 flex flex-col">
                    <h1>The Calculator</h1>
                    <MathField />
                </div>
            </Provider>
        );
    }
}
