import classNames from 'classnames';
import { observer } from 'mobx-react';
import { ValidatedField } from 'mobx-validated-field';
import * as React from 'react';
import { FormGroupHelpText } from './FormGroupHelpText';
import { InputControl } from './InputControl';

export interface IInputGroupProps {
    addonIcon?: string;
    button?: any;
    className?: string;
    children?: React.ReactNode;
    disabled?: boolean;
    field: ValidatedField;
    focusOnMount?: boolean;
    helpText?: string | JSX.Element;
    label?: string;
    onBlur?: (e: React.FocusEvent) => void;
    onCancel?: () => void;
    onChange?: (val: string) => void;
    onRef?: (input: HTMLInputElement) => void;
    onSubmit?: (val: string) => void;
    placeholder?: string;
    size?: 'lg';
    type?: string;
}

@observer
export class InputGroup extends React.Component<IInputGroupProps, {}> {

    constructor(props: IInputGroupProps) {
        super(props);
    }

    render() {
        const { field, label, size, helpText, addonIcon, placeholder } = this.props;

        const renderLabel = () => {
            if (label == null) return null;
            return <label>{ label }</label>;
        };

        const renderAddon = () => {
            if (addonIcon == null) return null;
            return (
                <span className="input-addon"><i className="icon icon-search icon-lg" /></span>
            );
        };

        const className = classNames(
            'input-group',
            size != null ? 'input-group-lg' : null,
            { disabled: this.props.disabled === true },
            { 'input-group--has-error': this.props.field.hasError },
            this.props.className,
        );

        return (
            <div className={className}>
                { renderLabel() }
                { renderAddon() }
                <InputControl
                    className="input-field"
                    disabled={this.props.disabled === true}
                    field={this.props.field}
                    focusOnMount={this.props.focusOnMount}
                    onBlur={this.props.onBlur}
                    onCancel={this.props.onCancel}
                    onChange={this.props.onChange}
                    onRef={this.props.onRef}
                    onSubmit={this.props.onSubmit}
                    placeholder={placeholder}
                    type={this.props.type}
                />
                { this.props.children }
                <FormGroupHelpText helpText={helpText} field={field} />
            </div>
        );
    }
}
