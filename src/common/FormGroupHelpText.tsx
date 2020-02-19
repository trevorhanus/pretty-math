import { observer } from 'mobx-react';
import { ValidatedField } from 'mobx-validated-field';
import * as React from 'react';

export interface IFormGroupHelpTextProps {
    helpText?: string | JSX.Element;
    field?: ValidatedField;
}

export const FormGroupHelpText = observer((props: IFormGroupHelpTextProps) => {
    const { helpText, field } = props;

    if (field && field.hasError) {
        return (
            <div className="input-group-help-text input-group-help-text--danger">
                <small>{field.firstErrorMessage}</small>
            </div>
        );
    }

    if (helpText != null) {
        return (
            <div className="input-group-help-text color-light">
                <small>{helpText}</small>
            </div>
        );
    }

    return null;
});
