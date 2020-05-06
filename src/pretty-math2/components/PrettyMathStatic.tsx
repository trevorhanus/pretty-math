import { observer } from 'mobx-react';
import * as React from 'react';
import { Editor, SerializedEditorState } from '../model/Editor';
import { Content } from './Content';

export interface IPrettyMathStaticProps {
    editorState: SerializedEditorState;
}

@observer
export class PrettyMathStatic extends React.Component<IPrettyMathStaticProps, {}> {
    editor: Editor;

    constructor(props: IPrettyMathStaticProps) {
        super(props);
        this.editor = Editor.fromState(this.props.editorState);
    }

    render() {
        return (
            <div className="pretty-math">
                <Content
                    editorState={this.editor}
                />
            </div>
        )
    }
}
