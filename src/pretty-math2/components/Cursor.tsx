import { observer } from 'mobx-react';
import * as React from 'react';
import { EditorState } from '../model/EditorState';

export interface ICursorProps {
    editorState: EditorState;
}

@observer
export class Cursor extends React.Component<ICursorProps, {}> {

    constructor(props: ICursorProps) {
        super(props);
    }

    render() {
        return (
            <div className="cursor-overlay">
                {this.renderCursor()}
            </div>
        );
    }

    renderCursor() {
        const { editorState } = this.props;

        if (!editorState.hasFocus) {
            return null;
        }

        const { selection } = editorState;

        if (!selection.isCollapsed) {
            return null;
        }

        const { block, offset } = selection.focus;
        const el = block.ref.current;

        if (!el) {
            return null;
        }

        // calculate the dimensions
        const style = {
            left: el.offsetLeft + (offset === 1 ? el.offsetWidth : 0) + 1,
            top: el.offsetTop,
            height: el.offsetHeight,
        };

        return (
            <span
                className="cursor"
                style={style}
            />
        );
    }
}
