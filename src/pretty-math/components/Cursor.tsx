import { haveWindow } from 'common';
import { observer } from 'mobx-react';
import * as React from 'react';
import classNames from 'classnames';
import { Editor, offsetFromAncestor } from 'pretty-math/internal';

export interface ICursorProps {
    editorState: Editor;
}

const BLINK_DELAY = 300;

@observer
export class Cursor extends React.Component<ICursorProps, {}> {
    private cursorRef: React.RefObject<HTMLSpanElement>;
    private key: number;
    private mounted: boolean;
    private mutationObserver: MutationObserver;
    private timer: any;

    constructor(props: ICursorProps) {
        super(props);
        this.mounted = false;
        this.cursorRef = React.createRef<HTMLSpanElement>();
        this.key = 1;
    }

    componentDidMount() {
        this.mounted = true;
        // setup our mutation observer
        if (haveWindow() && this.cursorRef.current) {
            require('mutationobserver-shim'); // polyfill for MutationObserver, uses native MutationObserver if it exists
            this.mutationObserver = new (window as any).MutationObserver(this.handleMutation);
            this.mutationObserver.observe(this.cursorRef.current, observerConfig);
        }
        this.calculatePosition();
    }

    componentDidUpdate(prevProps: Readonly<ICursorProps>, prevState: Readonly<{}>, snapshot?: any): void {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            // modify the ref directly
            if (this.cursorRef.current) {
                this.cursorRef.current.classList.add('cursor-blink');
            }
        }, BLINK_DELAY);
    }

    componentWillUnmount() {
        this.mounted = false;
        this.mutationObserver.disconnect();
        clearTimeout(this.timer);
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

        const className = classNames(
            'cursor',
            { 'cursor-hide': !editorState.hasFocus }
        );

        return (
            <span
                className={className}
                ref={this.cursorRef}
            />
        );
    }

    calculatePosition = () => {
        if (!this.mounted) {
            return;
        }

        const containerRef = this.props.editorState.containerRef.current;
        const targetRef = this.props.editorState.selection.focus.ref.current;
        const cursorRef = this.cursorRef.current;

        if (containerRef != null && targetRef != null && cursorRef != null) {
            const { offsetLeft, offsetTop } = offsetFromAncestor(containerRef, targetRef);
            const height = targetRef.offsetHeight;

            cursorRef.style.left = `${offsetLeft + 1}px`;
            cursorRef.style.top = `${offsetTop}px`;
            cursorRef.style.height = `${height}px`;
        }

        window.requestAnimationFrame(this.calculatePosition);
    };

    handleMutation = () => {
        // the position changed, so reset the timer
        clearTimeout(this.timer);
        this.cursorRef.current.classList.remove('cursor-blink');
        this.timer = setTimeout(() => {
            // modify the ref directly
            this.cursorRef.current.classList.add('cursor-blink');
        }, BLINK_DELAY);
    }
}

const observerConfig: MutationObserverInit = {
    attributes: true,
    attributeFilter: ['style'],
};
