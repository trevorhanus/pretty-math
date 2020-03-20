import { observer } from 'mobx-react';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { EditorState } from '../../model/EditorState';
import { SelectionRange } from '../../selection/SelectionRange';
import { getMathLibrary, Library } from '../library/Library';
import { LibraryEntry } from '../library/LibraryEntry';
import { AssistantForce } from '../stores/AssistantStore';
import { AssistantDialog } from './AssistantDialog';
import { AssistantPositioner } from './AssistantPositioner';

const PM_ASSISTANT_PORTAL_ID = 'pm-assistant-portal';

export interface IAssistantProps {
    boundingViewport?: HTMLElement;
    editor: EditorState;
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

        if (!editor.hasFocus) {
            return null;
        }

        if (editor.assistant.force === AssistantForce.Closed) {
            return null;
        }

        if (editor.assistant.force === AssistantForce.Open) {
            const library = getMathLibrary();
            return this.renderAssistant(library);
        }

        // else do we have any suggestions?
        const lastCommandWasInput = editor.lastCommand === 'input';
        const library = getMathLibrary();
        const phrase = rangeToText(editor.selection.trailingPhraseRange);
        const suggestions = library.getSuggested(phrase, editor);

        if (lastCommandWasInput && suggestions.length > 0) {
            return this.renderAssistant(library, suggestions);
        }

        return null;
    }

    renderAssistant(library: Library, suggestions?: LibraryEntry[]) {
        const { editor } = this.props;

        return createPortal(
            (
                <AssistantPositioner
                    boundingViewport={this.props.boundingViewport}
                    target={this.props.target}
                >
                    <AssistantDialog
                        library={library}
                        onCloseRequested={this.props.onCloseRequested}
                        onUnmount={() => editor.assistant.releaseForce()}
                        suggestions={suggestions || []}
                    />
                </AssistantPositioner>
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
}

function rangeToText(range: SelectionRange): string {
    if (range.isEmpty) {
        return '';
    }

    return range.blocks.reduce((text, b) => {
        text = text + b.data.text || '';
        return text;
    }, '');
}
