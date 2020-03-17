import { observer, Provider } from 'mobx-react';
import * as React from 'react';
import { PrettyMathInput } from 'pretty-math2';

import 'pretty-math2/style/pretty-math.scss';

export interface IApp2Props {
}

@observer
export class App2 extends React.Component<IApp2Props, {}> {

    constructor(props: IApp2Props) {
        super(props);
    }

    render() {
        return (
            <Provider>
                <div className="container mx-auto fixed inset-0 flex flex-col items-center pt-12">
                    <h1 className="text-xl text-center mb-4">Pretty Math Input</h1>
                    <div className="w-1/2">
                        <PrettyMathInput
                            handleCommand={(command: string) => {
                                console.log('command: ', command);
                                return 'not_handled'
                            }}
                        />
                    </div>
                </div>
            </Provider>
        );
    }
}
