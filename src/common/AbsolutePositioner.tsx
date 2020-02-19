import { observer } from 'mobx-react';
import * as React from 'react';
import classNames from 'classnames';

export interface IAbsolutePositionerProps {
    children?: React.ReactNode;
    className?: string;
    onTargetLost?: (pos: IAbsolutePositionerPosition) => void;
    target: HTMLElement;
}

export interface IAbsolutePositionerPosition {
    top: number;
    left: number;
    bottom: number;
    right: number;
}

@observer
export class AbsolutePositioner extends React.Component<IAbsolutePositionerProps, {}> {
    private mounted: boolean;
    private positioner: HTMLDivElement;

    constructor(props: IAbsolutePositionerProps) {
        super(props);
        this.mounted = false;
    }

    componentDidMount() {
        this.mounted = true;
        this.calculatePosition();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        const className = classNames(
            'absolute',
            this.props.className,
        );

        return (
            <div
                className={className}
                ref={this.setRef}
            >
                { this.props.children }
            </div>
        );
    }

    setRef = (ref: HTMLDivElement) => {
        this.positioner = ref;
    };

    calculatePosition = () => {
        if (!this.mounted) {
            return;
        }

        const { target } = this.props;

        if (!document.contains(target)) {
            if (this.props.onTargetLost) {
                this.props.onTargetLost({
                    top: this.positioner.offsetTop,
                    left: this.positioner.offsetLeft,
                    bottom: this.positioner.offsetTop + this.positioner.offsetHeight,
                    right: this.positioner.offsetLeft + this.positioner.offsetWidth
                });
            }
            return;
        }

        const targetRect = target.getBoundingClientRect();

        const top = targetRect.top;
        const left = targetRect.left;
        const width = targetRect.width;
        const height = targetRect.height;

        this.positioner.style.top = `${top}px`;
        this.positioner.style.left = `${left}px`;
        this.positioner.style.width = `${width}px`;
        this.positioner.style.height = `${height}px`;

        window.requestAnimationFrame(this.calculatePosition);
    }
}
