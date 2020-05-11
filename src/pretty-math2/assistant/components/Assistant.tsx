import { action } from 'mobx';
import { observer, Provider } from 'mobx-react';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { Editor } from '../../model/Editor';
import { LibraryEntry } from '../library/LibraryEntry';
import { AssistantForce } from '../stores/AssistantStore';
import { AssistantDialog } from './AssistantDialog';
import { AssistantPositioner } from './AssistantPositioner';

const PM_ASSISTANT_PORTAL_ID = 'pm-assistant-portal';

export interface IAssistantProps {
    boundingViewport?: HTMLElement;
    editor: Editor;
    onCloseRequested: () => void;
    target: HTMLElement;
}

@observer
export class Assistant extends React.Component<IAssistantProps, {}> {
    private portal: HTMLDivElement;

    constructor(props: IAssistantProps) {
        super(props);
        this.appendExternalPortalDivToBody();
    }

    render() {
        const { editor } = this.props;
        const { assistant } = editor;

        if (!editor.hasFocus) {
            return null;
        }

        if (assistant.force === AssistantForce.Closed) {
            return null;
        }

        if (assistant.force === AssistantForce.Open) {
            return this.renderAssistant();
        }

        // else do we have any suggestions?
        const lastCommandWasInput = editor.lastCommand === 'input';

        if (lastCommandWasInput && assistant.suggestions.length > 0) {
            return this.renderAssistant();
        }

        return null;
    }

    renderAssistant() {
        const { editor } = this.props;
        const { assistant } = editor;

        return createPortal(
            (
                <Provider
                    assistant={assistant}
                >
                    <AssistantPositioner
                        boundingViewport={this.props.boundingViewport}
                        target={this.props.target}
                    >
                        <AssistantDialog
                            onCloseRequested={this.props.onCloseRequested}
                            onSelect={this.handleEntrySelect}
                            onUnmount={this.handleUnmount}
                        />
                    </AssistantPositioner>
                </Provider>
            ),
            this.portal,
        );
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

    @action
    handleEntrySelect = (entry: LibraryEntry) => {
        const { editor } = this.props;
        entry.onSelect(editor);
        editor.assistant.releaseForce();
        editor.setLastCommand('assistant_entry_selected');
    };

    @action
    handleUnmount = () => {
        const { assistant } = this.props.editor;
        assistant.reset();
    }
}
