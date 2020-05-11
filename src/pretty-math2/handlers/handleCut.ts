import React from 'react';
import {
    Editor,
    handleCopy
} from 'pretty-math2/internal';

export function handleCut(editor: Editor, e: React.ClipboardEvent) {
    handleCopy(editor, e);
    if (!editor.selection.isCollapsed) {
        editor.remove();
    }
}
