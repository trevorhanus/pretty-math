import { observer } from 'mobx-react';
import * as React from 'react';
import { EditorState } from '../model/EditorState';

export interface ICursorProps {
    editorState: EditorState;
}

const BLINK_DELAY = 300;

@observer
export class Cursor extends React.Component<ICursorProps, {}> {
    private mounted: boolean;
    private _cursorRef: React.RefObject<HTMLSpanElement>;
    private _key: number;
    private _timer: any;

    constructor(props: ICursorProps) {
        super(props);
        this._cursorRef = React.createRef<HTMLSpanElement>();
        this._key = 1;
    }

    componentDidMount() {
        this.mounted = true;
        this.calculatePosition();
    }

    componentDidUpdate(prevProps: Readonly<ICursorProps>, prevState: Readonly<{}>, snapshot?: any): void {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
            // modify the ref directly
            if (this._cursorRef.current) {
                this._cursorRef.current.classList.add('cursor-blink');
            }
        }, BLINK_DELAY);
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

        const key = this._key++;

        return (
            <span
                className="cursor"
                key={key}
                ref={this._cursorRef}
            />
        );
    }

    calculatePosition = () => {
        if (!this.mounted) {
            return;
        }

        const targetRef = this.props.editorState.selection.focus.ref.current;
        const cursorRef = this._cursorRef.current;

        if (targetRef != null && cursorRef != null) {
            const left = targetRef.offsetLeft + 1;
            const top = targetRef.offsetTop;
            const height = targetRef.offsetHeight;

            cursorRef.style.left = `${left}px`;
            cursorRef.style.top = `${top}px`;
            cursorRef.style.height = `${height}px`;
        }

        window.requestAnimationFrame(this.calculatePosition);
    };
}
