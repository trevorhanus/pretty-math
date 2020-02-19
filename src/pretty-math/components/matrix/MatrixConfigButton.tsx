import { action, observable, runInAction } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { MatrixBlock } from 'pretty-math/blocks/MatrixBlock';
import { renderMatrixSizeForm } from 'pretty-math/components/matrix/MatrixSizeFormRenderer';
import { MathEngine } from 'pretty-math/engines/MathEngine';

export interface IMatrixConfigButtonProps {
    engine?: MathEngine;
    matrix: MatrixBlock;
}

@inject('engine')
@observer
export class MatrixConfigButton extends React.Component<IMatrixConfigButtonProps, {}> {
    @observable private _formOpen: boolean;

    constructor(props: IMatrixConfigButtonProps) {
        super(props);
        this._formOpen = false;
    }

    render() {
        const { engine, matrix } = this.props;

        if (this._formOpen) {
            return null;
        }

        if (!engine.hasFocus) {
            return null;
        }

        const focusInside = matrix.isInsideInclusive(engine.selection.focus.block);
        if (!focusInside) {
            return null;
        }

        const handleClick = action(async (e: React.MouseEvent) => {
            this._formOpen = true;
            const res = await renderMatrixSizeForm(matrix);

            runInAction(() => {
                if (res) {
                    matrix.updateSize(res.rows, res.cols);
                    // make sure the focus is still in the matrix
                    const { focus } = engine.selection;
                    if (!matrix.contains(focus.block)) {
                        engine.selection.anchorAt({ block: matrix.firstCell, offset: 0 });
                    }
                }

                this._formOpen = false;
                engine.focus();
            });
        });

        const handleMouseDown = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
        };

        return (
            <div
                className="matrix-config-button cursor-pointer flex border bg-white rounded shadow"
                onClick={handleClick}
                onMouseDown={handleMouseDown}
            >
                <i className="icon icon-library" />
            </div>
        );
    }
}
