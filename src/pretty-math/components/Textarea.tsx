import { observer } from 'mobx-react';
import * as React from 'react';

export interface ITextareaProps {
    onRef?: (ref: HTMLTextAreaElement) => void;

    onBlur?: (e: React.FocusEvent) => void;
    onFocus?: (e: React.FocusEvent) => void;

    onInput?: (e: React.ChangeEvent, val: string) => void;

    onBackspace?: (e: React.KeyboardEvent) => void;
    onDelete?: (e: React.KeyboardEvent) => void;
    onEscape?: (e: React.KeyboardEvent) => void;
    onReturn?: (e: React.KeyboardEvent) => void;
    onSelAll?: (e: React.KeyboardEvent) => void;
    onTab?: (e: React.KeyboardEvent) => void;

    onCopy?: (e: React.ClipboardEvent) => void;
    onCut?: (e: React.ClipboardEvent) => void;
    onPaste?: (e: React.ClipboardEvent, data: string) => void;

    onDown?: (e: React.KeyboardEvent) => void;
    onLeft?: (e: React.KeyboardEvent) => void;
    onRight?: (e: React.KeyboardEvent) => void;
    onUp?: (e: React.KeyboardEvent) => void;

    onRedo?: (e: React.KeyboardEvent) => void;
    onUndo?: (e: React.KeyboardEvent) => void;
}

@observer
export class Textarea extends React.Component<ITextareaProps, {}> {
    ref: HTMLTextAreaElement;

    constructor(props: ITextareaProps) {
        super(props);
    }

    render() {

        return (
            <textarea
                className="hidden-textarea"
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                onCopy={this.handleCopy}
                onCut={this.handleCut}
                onPaste={this.handlePaste}
                onFocus={this.handleFocus}
                onKeyDown={this.handleKeyDown}
                ref={this.handleRef}
                value={""}
            />
        )
    }

    handleBlur = (e: React.FocusEvent) => {
        if (this.props.onBlur) {
            this.props.onBlur(e);
        }
    };

    handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        this.invokeCb('onInput', e, value);
    };

    handleCopy = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        this.invokeCb('onCopy', e);
    };

    handleCut = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        this.invokeCb('onCut', e);
    };

    handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        // get the data being pasted in
        const data = e.clipboardData.getData('text/plain');
        this.invokeCb('onPaste', e, data);
    };

    handleFocus = (e: React.FocusEvent) => {
        this.invokeCb('onFocus', e);
    };

    handleKeyDown = (e: React.KeyboardEvent) => {
        switch (true) {

            case e.keyCode === 8:
                this.invokeCb('onBackspace', e);
                break;

            case e.keyCode === 9:
                this.invokeCb('onTab', e);
                break;

            case e.keyCode === 13:
                this.invokeCb('onReturn', e);
                break;

            case e.keyCode === 27:
                this.invokeCb('onEscape', e);
                break;

            case e.keyCode === 37:
                this.invokeCb('onLeft', e);
                break;

            case e.keyCode === 38:
                this.invokeCb('onUp', e);
                break;

            case e.keyCode === 39:
                this.invokeCb('onRight', e);
                break;

            case e.keyCode === 40:
                this.invokeCb('onDown', e);
                break;

            case e.keyCode === 46:
                this.invokeCb('onDelete', e);
                break;

            case e.keyCode === 65 && e.metaKey:
                this.invokeCb('onSelAll', e);
                break;

            // Y
            case e.keyCode === 89 && e.metaKey:
                this.invokeCb('onRedo', e);
                break;

            // Z
            case e.keyCode === 90 && e.metaKey && e.shiftKey:
                this.invokeCb('onRedo', e);
                break;
            // Z
            case e.keyCode === 90 && e.metaKey:
                this.invokeCb('onUndo', e);
                break;

            default:
                return;
        }
    };

    handleRef = (ref: HTMLTextAreaElement) => {
        this.props.onRef && this.props.onRef(ref);
        this.ref = ref;
    };

    invokeCb(name: string, e: React.SyntheticEvent, ...args: any[]) {
        e.preventDefault();
        // e.stopPropagation();
        const cb = (this.props as any)[name];
        if (cb != null) {
            cb(e, ...args);
        }
    }
}
