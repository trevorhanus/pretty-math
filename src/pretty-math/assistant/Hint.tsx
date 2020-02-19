import { inject, observer } from 'mobx-react';
import { AssistantStore, MathEngine, ViewState } from 'pretty-math/internal';
import * as React from 'react';

export interface IHintProps {
    engine?: MathEngine;
}

export const Hint = inject('engine')(observer((props: IHintProps) => {
    const { assistant } = props.engine;
    const { library } = assistant;

    const toggleFullLibrary = () => {
        library.toggleFullLibrary();
    };

    const fullLibraryLabel = library.viewState === ViewState.SuggestionsOnly ? 'Full Library' : 'Close Library';

    return (
        <div className="hint-wrapper flex">
            <span>
                { getHint(assistant) }
            </span>
            <span
                className="full-library-button ml-auto"
                onClick={toggleFullLibrary}
            >
                {fullLibraryLabel}
            </span>
        </div>
    );
}));

function getHint(assistant: AssistantStore): any {
    const { library } = assistant;

    switch (true) {

        case assistant.library.viewState === ViewState.FullLibrary:
            return <span>Press <span className="font-medium">Tab</span> to change tab.</span>;

        case assistant.library.suggestedEntries.length === 0:
            return <span>Press <span className="font-medium">\</span> to open full library.</span>;

        case library.focusedEntry == null:
            return <span>Press <span className="font-medium">Down arrow</span> to select.</span>;

        default:
            return <>Press <span className="font-medium">Enter</span> to select. <span className="font-medium">Esc</span> to hide.</>;

    }
}
