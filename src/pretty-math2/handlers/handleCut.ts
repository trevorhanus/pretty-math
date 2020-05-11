import React from 'react';
import { Editor } from 'pretty-math2/model/Editor';
import { handleCopy } from './handleCopy';

export function handleCut(editor: Editor, e: React.ClipboardEvent) {
    handleCopy(editor, e);
    if (!editor.selection.isCollapsed) {
        editor.remove();
    }
}
