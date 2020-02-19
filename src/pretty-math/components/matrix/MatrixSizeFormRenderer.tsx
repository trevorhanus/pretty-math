import { AbsolutePositioner } from 'common';
import { observer } from 'mobx-react';
import { MatrixBlock } from 'pretty-math/blocks/MatrixBlock';
import { IMatrixSizeFormProps, MatrixSizeForm } from 'pretty-math/components/matrix/MatrixSizeForm';
import { getPortal } from 'pretty-math/utils/OverlayPortal';
import * as React from 'react';

export interface IMatrixSizeFormPositionerProps extends IMatrixSizeFormProps {
    hide: (res?: MatrixSizeResponse) => void;
    target?: HTMLElement;
}

@observer
export class MatrixSizeFormPositioner extends React.Component<IMatrixSizeFormPositionerProps, {}> {

    constructor(props: IMatrixSizeFormPositionerProps) {
        super(props);
    }

    render() {
        const { target, matrixBlock } = this.props;
        const _target = target || (matrixBlock && matrixBlock.ref);

        return (
            <AbsolutePositioner
                className="pointer-events-none"
                target={_target}
            >
                <div
                    className="pointer-events-auto"
                    style={{ transform: 'translateY(-100%)' }}
                >
                    <MatrixSizeForm {...this.props} />
                </div>
            </AbsolutePositioner>
        )
    }
}

export interface MatrixSizeResponse {
    cols: number;
    rows: number;
}

export function renderMatrixSizeForm(matrix: MatrixBlock, target?: HTMLElement): Promise<MatrixSizeResponse> {
    return new Promise(resolve => {
        getPortal().show((hide) => {

            const handleCancel = () => {
                hide();
                resolve();
            };

            const handleSubmit = (rows: number, cols: number) => {
                hide();
                resolve({ rows, cols});
            };

            // wrap the form in a full-screen div, so that
            // when the user clicks outside the form to close
            // it, the pointer events don't propagate to sibling nodes

            return (
                <div className="fixed inset-0 pointer-events-auto">
                    <MatrixSizeFormPositioner
                        hide={hide}
                        matrixBlock={matrix}
                        onCancel={handleCancel}
                        onSubmit={handleSubmit}
                        target={target}
                    />
                </div>
            )
        });
    });
}
