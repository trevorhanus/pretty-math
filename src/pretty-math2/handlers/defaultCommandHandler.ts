import { action, runInAction } from 'mobx';
import React from 'react';
import { EditorState } from '../model/EditorState';
import { handleCursorMove } from './handleCursorMove';
import { handleDelete } from './handleDelete';
import { handleSelectionMove } from './handleSelectionMove';

const commands = {
    'delete': handleDelete,
    'force_assistant_open': action((editor: EditorState) => editor.assistant.forceOpen()),
    'force_assistant_closed': action((editor: EditorState) => editor.assistant.forceClosed()),
    'move_cursor': handleCursorMove,
    'move_selection': handleSelectionMove,
};

export function defaultCommandHandler(command: string, editorState: EditorState, e?: React.SyntheticEvent) {
    return runInAction(() => {
        const handler = commands[command];

        if (!handler) {
            return;
        }

        handler(editorState, e);
    });
}
