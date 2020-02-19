import { haveWindow } from 'common';
import { observer } from 'mobx-react';
import * as React from 'react';

export interface IMatrixBracketProps {
    rightBracket?: boolean;
    target: HTMLElement;
}

export interface IMatrixBracketState {
    height: number;
    fill: string;
}

@observer
export class MatrixBracket extends React.Component<IMatrixBracketProps, IMatrixBracketState> {
    span: HTMLSpanElement;
    mutationObserver: MutationObserver;

    constructor(props: IMatrixBracketProps) {
        super(props);
        this.state = {
            height: 0,
            fill: null,
        }
    }

    componentDidMount() {
        if (haveWindow()) {
            require('mutationobserver-shim'); // polyfill for MutationObserver, uses native MutationObserver if it exists
            this.mutationObserver = new (window as any).MutationObserver(this.handleMutation);
        }

        if (this.mutationObserver && this.props.target) {
            this.mutationObserver.observe(this.props.target, observerConfig);
            this.updateState();
        }
    }

    componentDidUpdate(prevProps: Readonly<IMatrixBracketProps>, prevState: Readonly<IMatrixBracketState>, snapshot?: any): void {
        if (this.mutationObserver && prevProps.target !== this.props.target) {
            this.mutationObserver.observe(this.props.target, observerConfig);
            this.updateState();
        }
    }

    componentWillUnmount() {
        this.mutationObserver && this.mutationObserver.disconnect();
    }

    render() {
        const { height } = this.state;
        const h = height;

        let style: any = {
            width: '7.188px',
            height: h,
        };

        if (this.props.rightBracket) {
            style = {
                ...style,
                transform: 'scale(-1, 1)',
            };
        }

        const ch = Math.max(0, h - 11.26); // connector height
        const bs = Math.max(0, h - 1.70); // bottom L start

        return (
            <span
                className="matrix-bracket"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    style={style}
                >
                    <path d="M 5.98 1.70 l -0.10 -0.10 q -1.09 0.03 -2.16 0.03 q -1.02 0.00 -2.14 -0.03 l -0.15 0.22 q 0.15 0.58 0.15 3.15 v 0.85 h 1.43 v -0.85 q 0.00 -1.31 0.07 -2.14 q 0.05 -0.60 1.19 -0.60 h 1.65 l 0.07 -0.09 v -0.44 z" stroke="none" />
                    <path d={`M 1.58 5.63 v ${ch} h 1.43 v -${ch} z`} stroke="none" />
                    <path d={`M 5.98 ${bs} l -0.10 0.10 q -1.09 -0.03 -2.16 -0.03 q -1.02 0.00 -2.14 0.03 l -0.15 -0.22 q 0.15 -0.58 0.15 -3.15 v -0.85 h 1.43 v 0.85 q 0.00 1.31 0.07 2.14 q 0.05 0.60 1.19 0.60 h 1.65 l 0.07 0.09 v 0.44 z`} stroke="none" />
                </svg>
            </span>
        )
    }

    handleMutation = () => {
        this.updateState();
    };

    updateState = () => {
        if (!this.props.target) {
            return;

        }

        this.setState({
            height: this.props.target.offsetHeight,
            fill: window.getComputedStyle(this.props.target).color
        });
    };
}

const observerConfig: MutationObserverInit = {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
};
