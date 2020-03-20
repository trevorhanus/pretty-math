import { observer } from 'mobx-react';
import * as React from 'react';
import { LibraryEntry } from '../library/LibraryEntry';
import { LibraryEntryItem } from './LibraryEntryItem';

export interface ILibraryEntryListProps {
    entries: LibraryEntry[];
}

export const LibraryEntryList = observer((props: ILibraryEntryListProps) => {
    const { entries } = props;

    if (entries.length === 0) {
        return (
            <div className="empty-list">
                No Suggestions
            </div>
        );
    }

    return (
        <div className="entry-list-scroller">
            <ul className="library-entry-list">
                {
                    entries.map((entry, i) => {
                        return (
                            <LibraryEntryItem
                                key={entry.id}
                                entry={entry}
                            />
                        );
                    })
                }
            </ul>
        </div>
    );
});
