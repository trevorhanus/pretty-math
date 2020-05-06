import { observer } from 'mobx-react';
import * as React from 'react';
import { Editor } from '../model/EditorState';

export interface IContentProps {
    editorState: Editor;
}

export const Content = observer((props: IContentProps) => {
    const { editorState } = props;

    return (
        <>
            {editorState.root.render()}
        </>
    );
});
