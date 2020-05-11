import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { AssistantStore } from '../stores/AssistantStore';

export interface IAssistantHintProps {
    assistant?: AssistantStore;
}

export const AssistantHint = inject('assistant')(observer((props: IAssistantHintProps) => {
    const { assistant } = props;

    const getHint = () => {
        switch (true) {

            case assistant.fullLibrary:
                return <span>Press <span className="font-medium">Tab</span> to change tab.</span>;

            case assistant.entryIndex === -1:
                return <span>Press <span className="font-medium">Down arrow</span> to select.</span>;

            case assistant.focusedItem != null:
                return <>Press <span className="font-medium">Enter</span> to select. <span className="font-medium">Esc</span> to hide.</>;

            default:
                return <span>&#8203;</span>
        }
    };

    const rightHint = () => {
        if (!assistant.fullLibrary) {
            return <span>Press <span className="font-medium">\</span> for full library.</span>;
        }

        return <span><span className="font-medium">Esc</span> to close.</span>
    };

    return (
        <div className="pm-assistant__hint">
            <span>
                {getHint()}
            </span>
            <span className="ml-auto">
                {rightHint()}
            </span>
        </div>
    );
}));
