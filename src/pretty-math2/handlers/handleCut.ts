import React from 'react';
import { EditorState } from 'pretty-math2/model/EditorState';
import { handleCopy } from './handleCopy';

export function handleCut(editorState: EditorState, e: React.ClipboardEvent) {
    handleCopy(editorState, e);
    if (!editorState.selection.isCollapsed) {
        editorState.remove();
    }
}