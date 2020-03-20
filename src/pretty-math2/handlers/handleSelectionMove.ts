import React from 'react';
import { EditorState } from 'pretty-math2/model/EditorState';
import { Dir } from 'pretty-math2/interfaces';

export function handleSelectionMove(editorState: EditorState, e: React.KeyboardEvent) {
    switch (e.keyCode) {
        case 37: // Left
            editorState.moveSelectionFocus(Dir.Left);
            break;
        case 38: // Up
            editorState.moveSelectionFocus(Dir.Up);
            break;
        case 39: // Right
            editorState.moveSelectionFocus(Dir.Right);
            break;
        case 40: // Down
            editorState.moveSelectionFocus(Dir.Down);
            break;
    }
}
