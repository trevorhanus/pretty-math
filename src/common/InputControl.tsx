import classNames from 'classnames';
import { KeyCodes } from 'common';
import { observer } from 'mobx-react';
import { ValidatedField } from 'mobx-validated-field';
import * as React from 'react';

export type HTMLControlElement = HTMLInputElement | HTMLTextAreaElement;

export interface IInputControlProps {
    className?: string;
    disabled?: boolean;
    elType?: string;
    field: ValidatedField;
    focusOnMount?: boolean;
    onBlur?: (e: React.FocusEvent) => void;
    onCancel?: () => void;
    onChange?: (val: string, e: React.ChangeEvent<HTMLControlElement>) => void;
    onRef?: (input: HTMLControlElement) => void;
    onSubmit?: (val: string) => void;
    placeholder?: string;
    type?: string;
}

@observer
export class InputControl extends React.Component<IInputControlProps, {}> {
    private cancelOnBlur: boolean;
    private ref: HTMLControlElement;

    constructor(props: IInputControlProps) {
        super(props);
        this.cancelOnBlur = false;
    }

    componentDidMount() {
        if (this.props.focusOnMount) {
            this.ref && this.ref.focus();
        }
    }

    render() {
        const elType = this.props.elType || 'input';

        const className = classNames(
            'input-field',
            this.props.className,
        );

        return React.createElement(elType, {
            className,
            value: this.props.field.value,
            onBlur: this.handleBlur,
            onChange: this.handleChange,
            onKeyDown: this.handleKeyDown,
            placeholder: this.props.placeholder,
            disabled: this.props.disabled,
            ref: this.handleRef,
            type: this.props.type,
        });
    }

    handleBlur = (e: React.FocusEvent) => {
        if (this.cancelOnBlur && this.props.onCancel != null) {
            this.props.onCancel();
        } else if (!this.cancelOnBlur && this.props.onSubmit != null) {
            const val = this.props.field.value;
            this.props.onSubmit(val);
        }

        this.cancelOnBlur = false;

        this.props.onBlur && this.props.onBlur(e);
        this.props.field.handleSubmit();
    };

    handleChange = (e: React.ChangeEvent<HTMLControlElement>) => {
        const val = e.currentTarget.value;
        this.props.field.handleChange(val);
        this.props.onChange && this.props.onChange(val, e);
    };

    handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.keyCode === KeyCodes.Escape) {
            this.cancelOnBlur = true;
            this.ref.blur();
        }

        if (e.keyCode === KeyCodes.Enter) {
            this.ref.blur();
        }
    };

    handleRef = (ref: HTMLControlElement) => {
        this.ref = ref;
        this.props.onRef && this.props.onRef(ref);
    };
}
