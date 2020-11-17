import classNames from 'classnames';
import { observer } from 'mobx-react';
import * as React from 'react';
import {
    PrettyMathStatic,
    LibrarySearchItem,
} from 'pretty-math/internal';

export interface IAssistantItemProps {
    item: LibrarySearchItem;
    focused: boolean;
    onSelect: (item: LibrarySearchItem) => void;
}

export const AssistantItem = observer((props: IAssistantItemProps) => {
    const { item } = props;
    const { entry } = item;

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        props.onSelect(item);
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
