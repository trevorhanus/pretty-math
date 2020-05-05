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
    readonly controller: EditorController;
    readonly editor: EditorState;

    constructor(props: IPrettyMathInputProps) {
        super(props);
        this.editor = EditorState.createMathRoot(props.editorState);
        this.controller = new EditorController(props, this.editor);
    }

    render() {
        return (
            <div
                className="pretty-math pm-input"
                ref={this.editor.containerRef}
                onMouseDown={this.handleMouseDown}
            >
                <textarea
                    className="hidden-textarea"
                    onBlur={() => this.editor.setFocus(false)}
                    onChange={this.controller.handleTextareaChange}
                    onFocus={() => this.editor.setFocus(true)}
                    onKeyDown={this.controller.handleKeyDown}
                    readOnly={this.props.readOnly}
                    ref={this.editor.hiddenTextareaRef}
                    value={""}
                />
                <Content editorState={this.editor} />
                <Cursor editorState={this.editor} />
                <Assistant
                    editor={this.editor}
                    onCloseRequested={() => this.controller.handleCommand('force_assistant_closed')}
                    target={this.editor.containerRef.current}
                />
            </div>
        );
    }

    handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();

        const blockData = e.nativeEvent.blockData;
        if (blockData) {
            this.editor.selection.anchorAt(blockData.block);
        } else {
            let cur = this.editor.inner.start;
            let curBoundingRect = cur.ref.current.getBoundingClientRect();
            while (cur.type != "end" && e.clientX >= curBoundingRect.left) {
                if (e.clientX >= curBoundingRect.left && e.clientX <= curBoundingRect.right) {
                    break;
                }
                cur = cur.next;
                curBoundingRect = cur.ref.current.getBoundingClientRect();
            }
            this.editor.selection.anchorAt(cur);
        }

        // const closestBlock = findClosestBlock(this.editor, e);
        // if (closestBlock) {
        //     this.editor.selection.anchorAt(closestBlock);
        // }

        window.addEventListener('mouseup', this.handleMouseUp);
        window.addEventListener('mousemove', this.handleMouseMove);

        this.editor.focus();
    };

    handleMouseMove = (e: MouseEvent) => {
        const blockData = (e as any).blockData;
        if (blockData) {
            this.editor.selection.focusAt(blockData.block);
        } else {
            let cur = this.editor.inner.start;
            let curBoundingRect = cur.ref.current.getBoundingClientRect();
            while (cur.type != "end" && e.clientX >= curBoundingRect.left) {
                if (e.clientX >= curBoundingRect.left && e.clientX <= curBoundingRect.right) {
                    break;
                }
                cur = cur.next;
                curBoundingRect = cur.ref.current.getBoundingClientRect();
            }
            this.editor.selection.focusAt(cur);
        }
    };

    handleMouseUp = (e: MouseEvent) => {
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.handleMouseUp);
    };
}
