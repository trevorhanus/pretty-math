import { inject, observer } from 'mobx-react';
import * as React from 'react';
import {
    AssistantEntryItem,
    AssistantStore,
    LibraryEntry
} from 'pretty-math2/internal';

export interface IAssistantEntryListProps {
    assistant?: AssistantStore;
    entries: LibraryEntry[];
    onSelect: (entry: LibraryEntry) => void;
}

@inject('assistant')
@observer
export class AssistantEntryList extends React.Component<IAssistantEntryListProps, {}> {

    constructor(props: IAssistantEntryListProps) {
        super(props);
        window.addEventListener('keydown', this.handleKeyDown, true);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown, true);
    }

    render() {
        const { entries, assistant } = this.props;

        if (entries.length === 0) {
            return (
                <div className="empty-list">
                    No Suggestions
                </div>
            );
        }

        return (
            <div className="pm-assistant__entry-list-scroller">
                <ul className="pm-assistant__entry-list">
                    {
                        entries.map((entry, i) => {
                            return (
                                <AssistantEntryItem
                                    key={entry.id}
                                    entry={entry}
                                    focused={assistant.isFocused(i)}
                                    onSelect={this.props.onSelect}
                                />
                            );
                        })
                    }
                </ul>
            </div>
        );
    }

    handleKeyDown = (e: KeyboardEvent) => {
        const { assistant } = this.props;
        let moved = false;

        switch (true) {

            case e.keyCode === 13: // Return
                if (assistant.focusedEntry) {
                    e.preventDefault();
                    this.props.onSelect(assistant.focusedEntry);
                }
                break;

            case e.keyCode === 38: // ArrowUp
                moved = assistant.moveFocus(-1);
                if (moved) {
                    e.preventDefault();
                }
                break;

            case e.keyCode === 40: // ArrowDown
                e.preventDefault();
                assistant.moveFocus(1);
                break;

        }
    };
}
