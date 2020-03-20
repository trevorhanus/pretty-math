import { observer } from 'mobx-react';
import * as React from 'react';
import { Library as LibraryModel } from '../library/Library';
import { LibraryEntry } from '../library/LibraryEntry';
import { LibraryEntryList } from './LibraryEntryList';

export interface ILibraryProps {
    library: LibraryModel;
    suggestions: LibraryEntry[];
    fullLibrary: boolean;
}

export const Library = observer((props: ILibraryProps) => {
    const handleWheel = (e: React.WheelEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            className="pm-library"
            onWheel={handleWheel}
        >
            <LibraryEntryList
                entries={props.suggestions}
            />
        </div>
    );
});
