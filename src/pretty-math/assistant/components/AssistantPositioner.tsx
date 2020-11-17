import { observer } from 'mobx-react';
import * as React from 'react';

export interface IAssistantPositionerProps {
    boundingViewport?: HTMLElement;
    target: HTMLElement;
}

@observer
export class AssistantPositioner extends React.Component<IAssistantPositionerProps, {}> {
    private mounted: boolean;
    private positioner: HTMLDivElement;

    constructor(props: IAssistantPositionerProps) {
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
        return (
            <div
                className="pm-assistant-positioner"
                ref={this.setRef}
            >
                {this.props.children}
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

        if (target != null) {
            const mathBbox = target.getBoundingClientRect();

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
