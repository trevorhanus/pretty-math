import React from 'react';
import { EditorState } from '../model/EditorState';
import { handleCursorMove } from './handleCursorMove';
import { handleDelete } from './handleDelete';
import { handleSelectionMove } from './handleSelectionMove';

const commands = {
    'cursor-move': handleCursorMove,
    'delete': handleDelete,
    'move_selection': handleSelectionMove,
};

export function defaultCommandHandler(command: string, editorState: EditorState, e?: React.SyntheticEvent) {
    const handler = commands[command];

    if (!handler) {
        return;
    }

    handler(editorState, e);
}
