import { observer } from 'mobx-react';
import * as React from 'react';
import { EditorState } from '../model/EditorState';

export interface IContentProps {
    editorState: EditorState;
}

export const Content = observer((props: IContentProps) => {
    const { editorState } = props;

    return (
        <>
            {editorState.root.render()}
        </>
    );
});
