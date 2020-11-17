import { observer } from 'mobx-react';
import { Editor } from 'pretty-math/internal';
import * as React from 'react';

export interface IContentProps {
    editor: Editor;
}

export const Content = observer((props: IContentProps) => {
    const { editor } = props;

    return (
        <>
            {editor.root.render()}
        </>
    );
});
