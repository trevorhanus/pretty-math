import { action } from 'mobx';
import * as React from 'react';
import {
    defaultCommandHandler,
    defaultKeyBindingFn,
    Editor,
    handleTextareaChange,
    IPrettyMathInputProps,
} from 'pretty-math/internal';

export class EditorController {
    readonly editor: Editor;
    readonly props: IPrettyMathInputProps;

    constructor(props: IPrettyMathInputProps, editorState: Editor) {
        this.editor = editorState;
        this.props = props;
    }

    @action
    handleKeyDown = (e: React.KeyboardEvent) => {
        if (this.props.readOnly) {
            return;
        }

        let command = null;

        if (this.props.keyBindingFn) {
            command = this.props.keyBindingFn(e);
        }

        command = command || defaultKeyBindingFn(e);
        if (command != null) {
            e.preventDefault();
            this.handleCommand(command, e);
        }
    };

    @action
    handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        handleTextareaChange(this.editor, e);
        this.editor.setLastCommand('input');
    };

    handleCommand(command: string, e?: React.SyntheticEvent) {
        let handled = 'not_handled';

        if (this.props.handleCommand) {
            handled = this.props.handleCommand(command, this.editor, e as React.KeyboardEvent);
        }

        if (handled === 'not_handled') {
            defaultCommandHandler(command, this.editor, e);
        }

        this.editor.setLastCommand(command);
    }
}
