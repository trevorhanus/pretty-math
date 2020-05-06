import { action } from 'mobx';
import * as React from 'react';
import { IPrettyMathInputProps } from '../components/PrettyMathInput';
import { defaultCommandHandler } from '../handlers/defaultCommandHandler';
import { defaultKeyBindingFn } from '../keybindings/defaultKeyBindingFn';
import { Editor } from './Editor';
import { handleTextareaChange } from 'pretty-math2/handlers/handleTextareaChange';

export class EditorController {
    readonly editorState: Editor;
    readonly props: IPrettyMathInputProps;

    constructor(props: IPrettyMathInputProps, editorState: Editor) {
        this.editorState = editorState;
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
        handleTextareaChange(this.editorState, e);
        this.editorState.setLastCommand('input');
    };

    handleCommand(command: string, e?: React.SyntheticEvent) {
        let handled = 'not_handled';

        if (this.props.handleCommand) {
            handled = this.props.handleCommand(command, this.editorState, e as React.KeyboardEvent);
        }

        if (handled === 'not_handled') {
            defaultCommandHandler(command, this.editorState, e);
        }

        this.editorState.setLastCommand(command);
    }
}
