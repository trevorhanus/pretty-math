import { observer } from 'mobx-react';
import * as React from 'react';
import { EditorState } from '../model/EditorState';

export interface ICursorProps {
    editorState: EditorState;
}

export interface ICursorState {
    left: number;
    top: number;
    height: number;
}

@observer
export class Cursor extends React.Component<ICursorProps, ICursorState> {
    private mounted: boolean;

    constructor(props: ICursorProps) {
        super(props);
        this.mounted = false;
        this.state = {
            left: 0,
            top: 0,
            height: 0
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
            <div className="cursor-overlay">
                {this.renderCursor()}
            </div>
        );
    }

    renderCursor() {
        const { editorState } = this.props;

        if (!editorState.hasFocus) {
            return null;
        }

        const { selection } = editorState;

        if (!selection.isCollapsed) {
            return null;
        }

        const style = {
            left: this.state.left + 1,
            top: this.state.top,
            height: this.state.height
        };

        return (
            <span
                className="cursor"
                style={style}
            />
        );
    }

    calculatePosition = () => {
        if (!this.mounted) {
            return;
        }

        const { ref } = this.props.editorState.selection.focus;

        if (ref != null) {
            const el = ref.current;

            if (!el) return;

            this.setState({
                left: el.offsetLeft + 1,
                top: el.offsetTop,
                height: el.offsetHeight
            });
        }

        window.requestAnimationFrame(this.calculatePosition);
    };
}
