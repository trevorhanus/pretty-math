import { inject, observer } from 'mobx-react';
import { Hint, Library } from 'pretty-math/components';
import { BlockUtils, LibraryEntry, MathEngine } from 'pretty-math/internal';
import * as React from 'react';

export interface IAssistantDialogProps {
    engine?: MathEngine;
}

@inject('engine')
@observer
export class AssistantDialog extends React.Component<IAssistantDialogProps, {}> {

    constructor(props: IAssistantDialogProps) {
        super(props);
    }

    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyDown, true);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown, true);
    }

    render() {
        return (
            <div className="assistant">
                <Library onSelect={this.handleSelect} />
                <Hint />
            </div>
        );
    }

    handleKeyDown = (e: KeyboardEvent) => {
        const { assistant } = this.props.engine;

        switch (true) {

            case e.keyCode === 9: // Tab
                assistant.handleTab(e);
                break;

            case e.keyCode === 13: // Return
                assistant.handleReturn(e);
                break;

            case e.keyCode === 27: // Escape
                assistant.handleEscape(e);
                break;

            case e.keyCode === 37: // Left
                // assistant.handleLeft(e);
                break;

            case e.keyCode === 38: // Up
                assistant.handleUp(e);
                break;

            case e.keyCode === 39: // Right
                // assistant.handleRight(e);
                break;

            case e.keyCode === 40: // Down
                assistant.handleDown(e);
                break;

        }
    };

    handleSelect = (entry: LibraryEntry) => {
        BlockUtils.replaceFocusedTokenWithLibraryEntry(this.props.engine.selection, entry);
    };
}
