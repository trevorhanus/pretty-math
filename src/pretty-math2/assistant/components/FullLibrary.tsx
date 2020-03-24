import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { LibraryEntry } from '../library/LibraryEntry';
import { AssistantStore } from '../stores/AssistantStore';
import { AssistantEntryList } from './AssistantEntryList';

export interface IFullLibraryProps {
    assistant?: AssistantStore;
    onSelect: (entry: LibraryEntry) => void;
}

@inject('assistant')
@observer
export class FullLibrary extends React.Component<IFullLibraryProps, {}> {

    constructor(props: IFullLibraryProps) {
        super(props);
        window.addEventListener('keydown', this.handleKeyDown, true);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown, true);
    }

    render() {
        const { assistant } = this.props;

        return (
            <div className="pm-assistant__full-library">
                <div className="pm-assistant__tabs">
                    {
                        assistant.categories.map(c => {
                            const className = classNames(
                                'pm-assistant__tab',
                                { 'pm-assistant__tab--focused': assistant.isFocusedCategory(c) }
                            );

                            return (
                                <div
                                    className={className}
                                    key={c}
                                    onClick={() => assistant.focusCategory(c)}
                                >
                                    {c}
                                </div>
                            )
                        })
                    }
                </div>
                <AssistantEntryList
                    entries={assistant.entriesUnderFocusedCategory}
                    onSelect={this.props.onSelect}
                />
            </div>
        );
    }

    handleKeyDown = (e: KeyboardEvent) => {
        const { assistant } = this.props;

        switch (true) {

            case e.shiftKey && e.keyCode === 9: // Shift + Tab
                e.preventDefault();
                assistant.nextTab(-1);
                break;

            case e.keyCode === 9: // Tab
                e.preventDefault();
                assistant.nextTab(1);
                break;
        }
    };
}
