import React from 'react';
import { EditorState } from 'pretty-math2/model/EditorState';
import { Dir } from 'pretty-math2/interfaces';
import { hasCommandModifier } from 'pretty-math2/utils/KeyUtils';

export function handleMoveCursor(editorState: EditorState, e: React.KeyboardEvent) {
    if (hasCommandModifier(e)) {

        switch (e.keyCode) {

            case 37: // Left
                editorState.moveCursorToFringe(Dir.Left);
                return;

            case 39: // Right
                editorState.moveCursorToFringe(Dir.Right);
                return;

        }
    }

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
