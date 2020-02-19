import { MathContext, MathExpr } from 'math';
import { Assistant, EditableField } from 'pretty-math/components';
import { Dir, MathEngine, MathFieldState } from 'pretty-math/internal';
import * as React from 'react';

export interface IMathFieldProps {
    boundingViewport?: HTMLElement;
    className?: string;
    disabled?: boolean;
    focusOnMount?: boolean;
    mathContext?: MathContext;
    mathExpr?: MathExpr;
    state?: MathFieldState;
    onBlur?: () => void;
    onCancel?: () => void;
    onChange?: (state: MathFieldState) => void;
    onCursorLeave?: (dir: Dir) => void;
    onDeleteOutOf?: (dir: Dir) => void;
    onFocus?: () => void;
    onInit?: (engine: MathEngine) => void;
    onSubmit?: (state: MathFieldState) => void;
}

export class MathField extends React.Component<IMathFieldProps, {}> {
    engine: MathEngine;

    constructor(props: IMathFieldProps) {
        super(props);
        this.engine = new MathEngine(props.mathContext);
    }

    componentDidMount() {
        const { mathExpr } = this.props;
        this.engine.setMathExpr(mathExpr);
    }

    render() {
        const props = {
            ...this.props,
            assistant: <Assistant boundingViewport={this.props.boundingViewport} />,
            engine: this.engine,
        };

        return <EditableField {...props} />
    }
}
