import { MathContext } from 'math';
import { observer } from 'mobx-react';
import { EditableField } from 'pretty-math/components';
import { Dir, MathFieldState, UnitsEngine } from 'pretty-math/internal';
import * as React from 'react';

export interface IUnitsFieldProps {
    state?: MathFieldState;
    className?: string;
    disabled?: boolean;
    focusOnMount?: boolean;
    mathContext?: MathContext;
    onBlur?: () => void;
    onCancel?: () => void;
    onChange?: (state: MathFieldState) => void;
    onCursorLeave?: (dir: Dir) => void;
    onDeleteOutOf?: (dir: Dir) => void;
    onFocus?: () => void;
    onInit?: (engine: UnitsEngine) => void;
    onSubmit?: (state: MathFieldState) => void;
}

@observer
export class UnitsField extends React.Component<IUnitsFieldProps, {}> {
    engine: UnitsEngine;

    constructor(props: IUnitsFieldProps) {
        super(props);
        this.engine = new UnitsEngine();
    }

    render() {
        const props = {
            ...this.props,
            engine: this.engine,
        };

        return <EditableField {...props} />;
    }
}
