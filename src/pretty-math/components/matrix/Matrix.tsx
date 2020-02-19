import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { EditableEngine, MatrixBlock } from 'pretty-math/internal';
import { BlockWrapper, Cursor, RenderChain, RenderStaticChain } from 'pretty-math/components';
import { MatrixBracket } from 'pretty-math/components/matrix/MatrixBracket';
import { MatrixConfigButton } from 'pretty-math/components/matrix/MatrixConfigButton';

export interface IMatrixProps {
    matrix: MatrixBlock;
    engine?: EditableEngine;
}

export interface IMatrixState {
    table: HTMLTableElement;
}

@inject('engine')
@observer
export class Matrix extends React.Component<IMatrixProps, IMatrixState> {

    constructor(props: IMatrixProps) {
        super(props);
        this.state = {
            table: null,
        };
    }

    render() {
        const { matrix, engine } = this.props;

        const focusInside = engine.hasFocus && matrix.isInside(engine.selection.focus.block);

        const className = classNames(
            'matrix',
            { 'focus-inside': focusInside }
        );

        return (
            <>
                <Cursor block={matrix} offset={0} />
                <BlockWrapper block={matrix}>
                    <span className={className}>

                        <span className="base-line">a</span>

                        <MatrixBracket
                            target={this.state.table}
                        />

                        <table
                            ref={this.setTableRef}
                        >
                            <tbody>
                                {matrix.rows.map(row => {
                                    const key = (row as any).$mobx.atom.name;
                                    return (
                                        <tr key={key}>
                                            {row.map(c => {
                                                return (
                                                    <td key={c.name}>
                                                        <RenderChain startBlock={c.chainStart} />
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>

                        <MatrixBracket
                            target={this.state.table}
                            rightBracket
                        />

                        <MatrixConfigButton
                            matrix={matrix}
                        />

                    </span>
                </BlockWrapper>
                <Cursor block={matrix} offset={1} />
            </>
        );
    }

    setTableRef = (ref: HTMLTableElement) => {
        this.setState({
            table: ref,
        });
    }
}

@observer
export class StaticMatrix extends React.Component<IMatrixProps, IMatrixState> {

    constructor(props: IMatrixProps) {
        super(props);
        this.state = {
            table: null,
        };
    }

    render() {
        const { matrix } = this.props;

        return (
            <span className="matrix">
                <span className="base-line">a</span>
                <MatrixBracket
                    target={this.state.table}
                />
                <table
                    ref={this.setTableRef}
                >
                    <tbody>
                        {matrix.rows.map(row => {
                            const key = (row as any).$mobx.atom.name;
                            return (
                                <tr key={key}>
                                    {row.map(c => {
                                        return (
                                            <td key={c.name}>
                                                <RenderStaticChain start={c.chainStart} />
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <MatrixBracket
                    target={this.state.table}
                    rightBracket
                />
            </span>
        );
    }

    setTableRef = (ref: HTMLTableElement) => {
        this.setState({
            table: ref,
        });
    };
}
