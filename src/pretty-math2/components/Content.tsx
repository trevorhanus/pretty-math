import { observer } from 'mobx-react';
import { Editor } from 'pretty-math2/internal';
import * as React from 'react';

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
