import { action } from 'mobx';
import * as React from 'react';
import { IPrettyMathInputProps } from '../components/PrettyMathInput';
import { defaultCommandHandler } from '../handlers/defaultCommandHandler';
import { defaultKeyBindingFn } from '../keybindings/defaultKeyBindingFn';
import { EditorState } from './EditorState';

export class EditorController {
    readonly editorState: EditorState;
    readonly props: IPrettyMathInputProps;

    constructor(props: IPrettyMathInputProps, editorState: EditorState) {
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
        this._handleCommand(command, e);
    };

    private _handleCommand(command: string, e?: React.SyntheticEvent) {
        if (!command) {
            return;
        }

        let handled = 'not_handled';

        if (this.props.handleCommand) {
            handled = this.props.handleCommand(command, this.editorState, e as React.KeyboardEvent);
        }

        if (handled === 'not_handled') {
            defaultCommandHandler(command, this.editorState, e);
        }
    }
}
