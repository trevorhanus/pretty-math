import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Assistant } from '../assistant/components/Assistant';
import { IBlockConfig } from '../interfaces';
import { Block } from '../model';
import { EditorController } from '../model/EditorController';
import { EditorState, SerializedEditorState } from '../model/EditorState';
import { Content } from './Content';
import { Cursor } from './Cursor';

export type CommandHandlerResponse = 'handled' | 'not_handled';

export interface IPrettyMathInputProps {
    editorState?: SerializedEditorState;
    keyBindingFn?: (e: React.KeyboardEvent) => string;
    handleCommand?: (command: string, editor: EditorState, e?: React.KeyboardEvent) => CommandHandlerResponse;
    customBlocks?: IBlockConfig<Block>[];
    onBlur?: (e: React.FocusEvent) => void;
    onFocus?: (e: React.FocusEvent) => void;
    readOnly?: boolean;
}

@observer
export class PrettyMathInput extends React.Component<IPrettyMathInputProps, {}> {
    @observable readonly containerRef: React.RefObject<HTMLDivElement>;
    readonly controller: EditorController;
    readonly editorState: EditorState;
    readonly hiddenTextareaRef: React.RefObject<HTMLTextAreaElement>;

    constructor(props: IPrettyMathInputProps) {
        super(props);
        this.containerRef = React.createRef<HTMLDivElement>();
        this.editorState = EditorState.createMathRoot();
        this.controller = new EditorController(props, this.editorState);
        this.hiddenTextareaRef = React.createRef<HTMLTextAreaElement>();
    }

    render() {
        return (
            <div
                className="pm-input"
                ref={this.containerRef}
                onMouseDown={this.handleMouseDown}
            >
                <textarea
                    className="hidden-textarea"
                    onBlur={() => this.editorState.setFocus(false)}
                    onChange={this.controller.handleTextareaChange}
                    onFocus={() => this.editorState.setFocus(true)}
                    onKeyDown={this.controller.handleKeyDown}
                    readOnly={this.props.readOnly}
                    ref={this.hiddenTextareaRef}
                    value={""}
                />
                <Content editorState={this.editorState} />
                <Cursor editorState={this.editorState} />
                <Assistant
                    editor={this.editorState}
                    onCloseRequested={() => this.controller.handleCommand('force_assistant_closed')}
                    target={this.containerRef.current}
                />
            </div>
        );
    }

    focus() {
        this.hiddenTextareaRef.current.focus();
    }

    handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();

        if (this.props.readOnly) {
            return;
        }

        this.hiddenTextareaRef.current.focus();
    };

    blur() {
        this.hiddenTextareaRef.current.blur();
    }
}
