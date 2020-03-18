import React from 'react';
import { EditorState } from '../model/EditorState';
import { handleCursorMove } from './handleCursorMove';
import { handleDelete } from './handleDelete';
import { handleInput } from './handleInput';

const commands = {
    'cursor-move': handleCursorMove,
    'delete': handleDelete,
    'input': handleInput,
};

export function defaultCommandHandler(command: string, editorState: EditorState, e?: React.SyntheticEvent) {
    const handler = commands[command];

    if (!handler) {
        return;
    }

    handler(editorState, e);
}
