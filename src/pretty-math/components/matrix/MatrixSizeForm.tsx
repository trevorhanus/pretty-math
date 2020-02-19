import { InputGroup, OnClickOutside } from 'common';
import { observer } from 'mobx-react';
import { ValidatedField } from 'mobx-validated-field';
import { MatrixBlock } from 'pretty-math/blocks/MatrixBlock';
import * as React from 'react';

export interface IMatrixSizeFormProps {
    matrixBlock: MatrixBlock;
    onCancel?: () => void;
    onSubmit?: (rows: number, cols: number) => void;
}

@observer
export class MatrixSizeForm extends React.Component<IMatrixSizeFormProps, {}> {
    rows: ValidatedField;
    cols: ValidatedField;

    constructor(props: IMatrixSizeFormProps) {
        super(props);
        this.rows = new ValidatedField();
        this.cols = new ValidatedField();
    }

    componentDidMount() {
        const { matrixBlock } = this.props;
        this.rows.init(matrixBlock.numRows.toString());
        this.cols.init(matrixBlock.numCols.toString());
        window.addEventListener('keydown', this.handleKeyDown, true);
    }

    componentWillUnmount(): void {
        window.removeEventListener('keydown', this.handleKeyDown, true);
    }

    render() {
        return (
            <OnClickOutside
                onClickOutside={this.handleClickOutside}
            >
                <div
                    className="inline-flex p-2 bg-white border rounded shadow"
                >
                    <div className="w-24 mr-2">
                        <InputGroup
                            className="input-group--horizontal input-group--sm"
                            field={this.rows}
                            focusOnMount
                            label="Rows"
                        />
                    </div>
                    <div className="w-24">
                        <InputGroup
                            className="input-group--horizontal input-group--sm"
                            field={this.cols}
                            label="Cols"
                        />
                    </div>
                </div>
            </OnClickOutside>
        )
    }

    handleClickOutside = () => {
        this.submitForm();
    };

    handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {

            case 'Escape':
                e.stopPropagation();
                e.preventDefault();
                this.props.onCancel && this.props.onCancel();
                break;

            case 'Enter':
                e.stopPropagation();
                e.preventDefault();
                this.submitForm();
                break;
        }
    };

    submitForm = () => {
        const cols = parseInt(this.cols.value);
        const rows = parseInt(this.rows.value);
        this.props.onSubmit && this.props.onSubmit(rows, cols);
    }
}
