import classNames from 'classnames';
import { MathExpr } from 'math';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Store } from './Store';

export interface IInputEditorProps {
    store?: Store;
}

export const InputEditor = inject('store')(observer((props: IInputEditorProps) => {
    const { store } = props;

    return (
        <div className="w-full h-full">
            {
                store.mathCxt.exprs.map(expr => {
                    return <ExprEditor key={expr.id} expr={expr} />;
                })
            }
            <div
                className="cursor-pointer px-4 py-3 hover:bg-green-100"
                onClick={store.addExpr}
            >
                <span
                    className="p-2 cursor-pointer rounded border mr-2 text-sm"
                >
                    Add Expr
                </span>
            </div>
        </div>
    );
}));

export interface IExprEditorProps {
    expr: MathExpr;
    store?: Store;
}

@inject('store')
@observer
export class ExprEditor extends React.Component<IExprEditorProps, {}> {
    input: HTMLInputElement;

    constructor(props: IExprEditorProps) {
        super(props);
    }

    render() {
        const { expr, store } = this.props;

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.currentTarget.value;
            expr.updateExpr(val);
        };

        const renderOutput = () => {
            if (expr.error) {
                return (
                    <span className="text-red-600">
                        {expr.error.message}
                    </span>
                )
            }

            if (!expr.primitiveNumber || isNaN(expr.primitiveNumber)) {
                return null;
            }

            return (
                <span className="rounded bg-purple-100 p-2">
                    {expr.primitiveNumber}
                </span>
            )
        };

        const renderDeleteButton = () => {
            const handleClick = () => {
                store.mathCxt.removeExprById(expr.id);
            };

            return (
                <div
                    className="delete-button absolute p-1 border rounded cursor-pointer text-red-800 bg-white shadow"
                    onClick={handleClick}
                >
                    x
                </div>
            );
        };

        const className = classNames(
            'expr',
            'cursor-text',
            'px-4 py-2 border-b',
            'relative flex items-center',
            { 'active-expr': store.activeExpr === expr },
        );

        return (
            <div
                className={className}
                onClick={this.handleClick}
            >
                <input
                    className="outline-none font-mono flex-grow py-2"
                    onChange={handleChange}
                    onFocus={this.handleFocus}
                    ref={this.setRef}
                    value={expr.expr}
                />
                { renderOutput() }
                { renderDeleteButton() }
            </div>
        );
    }

    handleClick = () => {
        this.input && this.input.focus();
    };

    handleFocus = () => {
        const { expr } = this.props;
        this.props.store.setActiveExpr(expr.id);
    };

    setRef = (input: HTMLInputElement) => {
        this.input = input;
    }
}
