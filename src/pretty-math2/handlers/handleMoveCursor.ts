import React from 'react';
import { EditorState } from 'pretty-math2/model/EditorState';
import { Dir } from 'pretty-math2/interfaces';

export function handleMoveCursor(editorState: EditorState, e: React.KeyboardEvent) {
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

export function handleMoveCursorEnd(editorState: EditorState, e: React.KeyboardEvent) {
    let dir = null;
    switch (e.keyCode) {
        case 37: // Left
            dir = Dir.Left;
            break;
        case 39: // Right
            dir = Dir.Right;
            break;
    }

    editorState.moveCursorEnd(dir);
}
