import React from 'react';
import { EditorState } from '../model/EditorState';
import { handleInput } from './handleInput';

const commands = {
    'input': handleInput,
};

export function defaultCommandHandler(command: string, editorState: EditorState, e?: React.SyntheticEvent) {
    const handler = commands[command];

    if (!handler) {
        return;
    }

    handler(editorState, e);
}
