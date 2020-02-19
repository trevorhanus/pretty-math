import { storiesOf } from '@storybook/react';
import { MathContext } from 'math';
import { Provider } from 'mobx-react';
import { AssistantDialog } from 'pretty-math/components';
import { MathEngine } from 'pretty-math/internal';
import * as React from 'react';

storiesOf('Pretty Math/Assistant', module)

    .add('With Many Suggestions', () => {
        const mathCxt = new MathContext();
        const engine = new MathEngine(mathCxt);
        engine.init({ });

        engine.assistant.forceOpenLibrary();
        engine.handler.insertText('f');

        return (
            <>
                <Provider engine={engine}>
                    <div style={{ width: 450 }}>
                        <AssistantDialog />
                    </div>
                </Provider>
            </>
        )
    })

    .add('Just a Few Suggestions', () => {
        const mathCxt = new MathContext();
        const engine = new MathEngine(mathCxt);
        engine.init({ });

        engine.assistant.forceOpenLibrary();
        engine.handler.insertText('sin');

        return (
            <>
                <Provider engine={engine}>
                    <div style={{ width: 450 }}>
                        <AssistantDialog />
                    </div>
                </Provider>
            </>
        )
    });
