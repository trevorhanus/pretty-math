import React from 'react';
import { EditorState } from 'pretty-math2/model/EditorState';
import { Dir } from 'pretty-math2/interfaces';

export function handleCursorMove(editorState: EditorState, e: React.KeyboardEvent) {
    switch (e.keyCode) {
        case 37: // Left
            editorState.moveCursor(Dir.Left);
            break;
        case 38: // Up
            editorState.moveCursor(Dir.Up);
            break;
        case 39: // Right
            editorState.moveCursor(Dir.Right);
            break;
        case 40: // Down
            editorState.moveCursor(Dir.Down);
            break;
    }
}