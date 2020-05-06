import React from 'react';
import { Dir } from 'pretty-math2/interfaces';
import { Editor } from 'pretty-math2/model/Editor';
import { hasCommandModifier } from 'pretty-math2/utils/KeyUtils';

export function handleExpandSelection(editorState: Editor, e: React.KeyboardEvent) {
    if (hasCommandModifier(e)) {
        switch (e.keyCode) {
            case 37: // Left
                editorState.moveSelectionFocusToFringe(Dir.Left);
                return;

            case 38: // Up
                editorState.moveSelectionFocusToFringe(Dir.Up);
                return;

            case 39: // Right
                editorState.moveSelectionFocusToFringe(Dir.Right);
                return;

            case 40: // Down
                editorState.moveSelectionFocusToFringe(Dir.Down);
                return;
        }
    }

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
