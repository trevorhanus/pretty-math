import { inject, observer } from 'mobx-react';
import { AssistantPositioner } from 'pretty-math/components';
import { MathEngine } from 'pretty-math/internal';
import * as React from 'react';
import { createPortal } from 'react-dom';

const PM_ASSISTANT_PORTAL_ID = 'pretty-math-assistant-portal';

export interface IAssistantProps {
    boundingViewport?: HTMLElement;
    engine?: MathEngine;
}

@inject('engine')
@observer
export class Assistant extends React.Component<IAssistantProps, {}> {
    private portal: HTMLDivElement;

    constructor(props: IAssistantProps) {
        super(props);
    }

    componentDidMount() {
        this.appendExternalPortalDivToBody();
    }

    render() {
        const { engine } = this.props;

        if (engine.assistant.doShow) {
            return createPortal(
                <AssistantPositioner boundingViewport={this.props.boundingViewport} />,
                this.portal,
            );
        } else {
            return null;
        }
    }

    private appendExternalPortalDivToBody() {
        let portal = document.getElementById(PM_ASSISTANT_PORTAL_ID);
        if (!portal) {
            portal = document.createElement('div');
            portal.setAttribute('id', PM_ASSISTANT_PORTAL_ID);
            document.body.appendChild(portal);
        }
        this.portal = portal as HTMLDivElement;
    }
}
