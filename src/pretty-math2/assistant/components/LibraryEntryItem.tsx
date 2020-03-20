import { observer } from 'mobx-react';
import * as React from 'react';
import { PrettyMathStatic } from '../../components/PrettyMathStatic';
import { LibraryEntry } from '../library/LibraryEntry';

export interface ILibraryEntryItemProps {
    entry: LibraryEntry;
}

export const LibraryEntryItem = observer((props: ILibraryEntryItemProps) => {
    const { entry } = props;

    return (
        <div>
            <PrettyMathStatic editorState={entry.preview} />
            {entry.description}
        </div>
    );
});
