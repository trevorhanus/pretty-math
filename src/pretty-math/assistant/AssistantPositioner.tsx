import { inject, observer } from 'mobx-react';
import { AssistantDialog } from 'pretty-math/components';
import { MathEngine } from 'pretty-math/internal';
import * as React from 'react';

export interface IAssistantPositionerProps {
    boundingViewport?: HTMLElement;
    engine?: MathEngine;
}

export interface IAssistantPositionerState {
    top: number;
    left: number;
}

@inject('engine')
@observer
export class AssistantPositioner extends React.Component<IAssistantPositionerProps, IAssistantPositionerState> {
    private mounted: boolean;
    private positioner: HTMLDivElement;

    constructor(props: IAssistantPositionerProps) {
        super(props);
        this.mounted = false;
        this.state = {
            top: null,
            left: null,
        }
    }

    componentDidMount() {
        this.mounted = true;
        this.calculatePosition();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        return (
            <div
                className="assistant__positioner"
                ref={this.setRef}
            >
                <AssistantDialog />
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

        const { engine } = this.props;
        const mathFieldRef = engine.fieldRef;

        if (mathFieldRef != null) {
            const mathBbox = mathFieldRef.getBoundingClientRect();

            let top = mathBbox.bottom;
            let left = mathBbox.left;

            const boundingBbox = this.getBoundingViewportClientRect();
            const posiBbox = this.positioner.getBoundingClientRect();

            if (mathBbox.bottom + posiBbox.height > boundingBbox.bottom) {
                top = mathBbox.top - posiBbox.height
            }

            if (mathBbox.left + posiBbox.width > boundingBbox.right) {
                left = mathBbox.right - posiBbox.width;
            }

            this.positioner.style.top = `${top}px`;
            this.positioner.style.left = `${left}px`;
        }

        window.requestAnimationFrame(this.calculatePosition);
    };

    getBoundingViewportClientRect(): ClientRect {
        if (this.props.boundingViewport) {
            return this.props.boundingViewport.getBoundingClientRect();
        } else {
            // use the window
            return {
                bottom: window.innerHeight,
                height: window.innerHeight,
                left: 0,
                right: window.innerWidth,
                top: 0,
                width: window.innerWidth,
            }
        }
    };
}
