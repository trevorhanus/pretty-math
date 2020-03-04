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
                <div className="container mx-auto fixed inset-0 flex flex-col items-center pt-12">
                    <h1 className="text-xl text-center mb-4">Pretty Math Input</h1>
                    <div className="w-1/2">
                        <MathField
                            className="text-2xl p-2"
                        />
                    </div>
                </div>
            </Provider>
        );
    }
}
