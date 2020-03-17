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
            <span>&#8203;</span>
            {editorState.content.render()}
        </>
    );
});
