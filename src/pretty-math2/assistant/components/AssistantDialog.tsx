import { observer } from 'mobx-react';
import * as React from 'react';
import { Library } from '../library/Library';
import { LibraryEntry } from '../library/LibraryEntry';
import { AssistantStore } from '../stores/AssistantStore';
import { Library as LibraryComponent } from './Library';

export interface IAssistantDialogProps {
    library: Library;
    onCloseRequested: () => void;
    onUnmount: () => void;
    suggestions: LibraryEntry[];
}

@observer
export class AssistantDialog extends React.Component<IAssistantDialogProps, {}> {
    store: AssistantStore;

    constructor(props: IAssistantDialogProps) {
        super(props);
        this.store = new AssistantStore();
        window.addEventListener('keydown', this.handleKeyDown, true);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown, true);
        this.props.onUnmount();
    }

    render() {
        return (
            <div className="pm-assistant">
                <LibraryComponent
                    library={this.props.library}
                    suggestions={this.props.suggestions}
                    fullLibrary={false}
                />
                {/*<Hint />*/}
            </div>
        );
    }

    handleKeyDown = (e: KeyboardEvent) => {
        switch (true) {

            case e.keyCode === 9: // Tab
                // assistant.handleTab(e);
                break;

            case e.keyCode === 13: // Return
                // assistant.handleReturn(e);
                break;

            case e.keyCode === 27: // Escape
                e.preventDefault();
                this.props.onCloseRequested();
                break;

            case e.keyCode === 37: // Left
                // assistant.handleLeft(e);
                break;

            case e.keyCode === 38: // Up
                // assistant.handleUp(e);
                break;

            case e.keyCode === 39: // Right
                // assistant.handleRight(e);
                break;

            case e.keyCode === 40: // Down
                // assistant.handleDown(e);
                break;

        }
    };

    handleSelect = (entry: LibraryEntry) => {
        // BlockUtils.replaceFocusedTokenWithLibraryEntry(this.props.engine.selection, entry);
    };
}
