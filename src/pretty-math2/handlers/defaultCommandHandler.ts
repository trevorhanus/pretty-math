import { action, runInAction } from 'mobx';
import React from 'react';
import { Editor } from '../model/Editor';
import { handleDelete } from './handleDelete';
import { handleExpandSelection } from './handleExpandSelection';
import { handleMoveCursor } from './handleMoveCursor';

const logSelection = (editor: Editor) => {
    const { start, end } = editor.selection.range;

    const startData = {
        type: start ? start.type : 'no start block',
        text: start ? start.toCalchub().text : '',
    };

    const endData = {
        type: end ? end.type : 'no end block',
        text: end ? end.toCalchub().text : '',
    };

    console.log(`Start: ${JSON.stringify(startData)}`);
    console.log(`End: ${JSON.stringify(endData)}`);
};

const commands = {
    'blur': action((editor: Editor) => editor.blur()),
    'delete': handleDelete,
    'expand_selection': handleExpandSelection,
    'force_assistant_open': action((editor: Editor) => editor.assistant.forceOpen()),
    'force_assistant_closed': action((editor: Editor) => editor.assistant.forceClosed()),
    'log_calchub': editor => console.log(JSON.stringify(editor.root.toCalchub().text, null, 2)),
    'log_selection': logSelection,
    'log_state': editor => console.log(JSON.stringify(editor.serialize(), null, 2)),
    'move_cursor': handleMoveCursor,
    'redo': action((editor: Editor) => editor.history.redo()),
    'undo': action((editor: Editor) => editor.history.undo()),
};

export function defaultCommandHandler(command: string, editorState: Editor, e?: React.SyntheticEvent) {
    return runInAction(() => {
        const handler = commands[command];

        if (!handler) {
            return;
        }

        handler(editorState, e);
    });
}
