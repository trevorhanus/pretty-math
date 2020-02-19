import { inject, observer } from 'mobx-react';
import { LibraryEntryItem } from 'pretty-math/assistant/LibraryEntryItem';
import { LibraryEntry, MathEngine } from 'pretty-math/internal';
import * as React from 'react';
import { ViewState } from './AssistantLibrary';

export interface ILibraryEntryListProps {
    entries: LibraryEntry[];
    onSelect?: (entry: LibraryEntry) => void;
    engine?: MathEngine;
}

@inject('engine')
@observer
export class LibraryEntryList extends React.Component<ILibraryEntryListProps, {}> {

    constructor(props: ILibraryEntryListProps) {
        super(props);
    }

    render() {
        const { entries } = this.props;
        const { library } = this.props.engine.assistant;

        if (!entries || entries.length === 0) {
            return (
                <div className="empty-list"> 
                    { library.viewState === ViewState.FullLibrary && "No Suggestions" }
                </div>
            );
        }

        return (
            <div className="entry-list-scroller">
                <ul className="library-entry-list">
                    {
                        entries.map((entry, i) => {
                            const focused = library.indexIsFocused(i);
                            return (
                                <LibraryEntryItem
                                    key={entry.id}
                                    entry={entry}
                                    focused={focused}
                                />
                            );
                        })
                    }
                </ul>
            </div>
        )
    }
}
