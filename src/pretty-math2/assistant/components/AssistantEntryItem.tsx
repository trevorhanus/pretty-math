import classNames from 'classnames';
import { observer } from 'mobx-react';
import * as React from 'react';
import {
    LibraryEntry,
    PrettyMathStatic
} from 'pretty-math2/internal';

export interface IAssistantEntryItemProps {
    entry: LibraryEntry;
    focused: boolean;
    onSelect: (entry: LibraryEntry) => void;
}

export const AssistantEntryItem = observer((props: IAssistantEntryItemProps) => {
    const { entry } = props;

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        props.onSelect(entry);
    };

    const handleRef = (ref: HTMLLIElement) => {
        entry.ref = ref;
    };

    const className = classNames(
        'pm-assistant__entry-item',
        { 'pm-assistant__entry-item--focused': props.focused },
    );

    return (
        <li
            className={className}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            ref={handleRef}
        >
            <PrettyMathStatic editorState={entry.preview} />
            <div className="pm-entry-item__description">
                {entry.description}
            </div>
        </li>
    );
});
