import { observer, Provider } from 'mobx-react';
import * as React from 'react';
import { PrettyMathInput } from 'pretty-math2';

import 'pretty-math2/style/pretty-math.scss';
import { SerializedEditorState } from '../../src/pretty-math2/model/EditorState';

export interface IApp2Props {
}

const INITIAL_STATE: SerializedEditorState = {
    root: {
        type: 'root:math',
        children: {
            inner: [
                {
                    type: 'atomic',
                    data: { text: 'a' }
                },
                {
                    type: 'atomic',
                    data: { text: '+' },
                },
                {
                    type: 'atomic',
                    data: { text: 'b' },
                },
                {
                    type: 'end',
                }
            ]
        }
    }
};

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
                            // editorState={INITIAL_STATE}
                        />
                    </div>
                </div>
            </Provider>
        );
    }
}
