import isEqual from 'lodash.isequal';
import { INode, MathContext } from 'math';
import { observer } from 'mobx-react';
import { StaticMathRoot } from 'pretty-math/components';
import { BlockChainState, MathFieldState, StaticMathEngine } from 'pretty-math/internal';
import * as React from 'react';

export interface IStaticMathProps {
    ast?: INode;
    className?: string;
    expr?: string;
    state?: MathFieldState;
    math?: string | MathFieldState | BlockChainState;
    fontSize?: number;
    mathContext?: MathContext;
}

@observer
export class StaticMath extends React.Component<IStaticMathProps, {}> {
    engine: StaticMathEngine;

    constructor(props: IStaticMathProps) {
        super(props);
        this.engine = new StaticMathEngine(props.mathContext);
        const math = this.props.math || this.props.state || this.props.expr;
        const { ast } = this.props;
        this.engine.init({ math, ast });
    }

    componentDidUpdate(prevProps: IStaticMathProps) {
        const { expr: newExpr, state: newState, ast: newAst } = this.props;
        const exprChanged = newExpr && newExpr !== prevProps.expr;
        const stateChanged = !isEqual(newState, prevProps.state);
        const astChanged = prevProps.ast !== newAst;
        if (exprChanged || stateChanged || astChanged) {
            const math = this.props.math || this.props.state || this.props.expr;
            const { ast } = this.props;
            this.engine.init({ math, ast });
        }
    }

    render() {
        return (
            <span className={this.props.className}>
                <StaticMathRoot
                    rootBlock={this.engine.root}
                    fontSize={this.props.fontSize}
                />
            </span>
        );
    }
}
