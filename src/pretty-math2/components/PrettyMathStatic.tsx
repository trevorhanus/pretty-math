import { observer } from 'mobx-react';
import * as React from 'react';
import { EditorState, SerializedEditorState } from '../model/EditorState';
import { Content } from './Content';

export interface IPrettyMathStaticProps {
    editorState: SerializedEditorState;
}

@observer
export class PrettyMathStatic extends React.Component<IPrettyMathStaticProps, {}> {
    editor: EditorState;

    constructor(props: IPrettyMathStaticProps) {
        super(props);
        this.editor = EditorState.fromState(this.props.editorState);
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
