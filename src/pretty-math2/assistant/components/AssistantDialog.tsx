import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { LibraryEntry } from '../library/LibraryEntry';
import { AssistantStore } from '../stores/AssistantStore';
import { AssistantEntryList } from './AssistantEntryList';
import { AssistantHint } from './AssistantHint';
import { FullLibrary } from './FullLibrary';

export interface IAssistantDialogProps {
    onCloseRequested: () => void;
    onSelect: (entry: LibraryEntry) => void;
    onUnmount: () => void;
    assistant?: AssistantStore;
}

@inject('assistant')
@observer
export class AssistantDialog extends React.Component<IAssistantDialogProps, {}> {

    constructor(props: IAssistantDialogProps) {
        super(props);
        window.addEventListener('keydown', this.handleKeyDown, true);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown, true);
        this.props.onUnmount();
    }

    render() {
        return (
            <div
                className="pm-assistant"
                onWheel={this.handleWheel}
            >
                {this.renderContent()}
                <AssistantHint />
            </div>
        );
    }

    renderContent() {
        if (this.assistant.fullLibrary) {
            return <FullLibrary onSelect={this.props.onSelect} />
        }

        return (
            <AssistantEntryList
                entries={this.assistant.suggestions}
                onSelect={this.props.onSelect}
            />
        );
    }

    get assistant(): AssistantStore {
        return this.props.assistant;
    }

    handleKeyDown = (e: KeyboardEvent) => {

        switch (true) {

            case e.keyCode === 27: // Escape
                e.preventDefault();
                this.props.onCloseRequested();
                break;

        }
    };

    handleWheel = (e: React.WheelEvent) => {
        e.stopPropagation();
    };
}
