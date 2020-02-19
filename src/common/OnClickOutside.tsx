import * as React from 'react';

export interface IOnClickOutssideProps {
    onClickOutside: (e: MouseEvent | TouchEvent) => void;
}

export class OnClickOutside extends React.Component<IOnClickOutssideProps, {}> {
    private heardMouseDown: boolean;
    private mouseIsDownOnMe: boolean;
    private touchIsDownOnMe: boolean;

    constructor(props: IOnClickOutssideProps) {
        super(props);
        this.heardMouseDown = false;
        this.mouseIsDownOnMe = false;
        this.touchIsDownOnMe = false;
    }

    componentDidMount() {
        window.addEventListener('mousedown', this.handleWindowMouseDown, true);
        window.addEventListener('mouseup', this.handleMouseUp, true); // want to grab it before it's propagation is stopped by another handler, so use capture
        window.addEventListener('touchend', this.handleTouchend, true);
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown', this.handleWindowMouseDown, true);
        window.removeEventListener('mouseup', this.handleMouseUp, true);
        window.removeEventListener('touchend', this.handleTouchend, true);
    }

    handleWindowMouseDown = () => {
        // need to make sure we have heard at least one mousedown
        // this fixes the bug where the component was mounted as a result of a mousedown
        // and the onClickOutside fires on mouseup
        this.heardMouseDown = true;
        window.removeEventListener('mousedown', this.handleWindowMouseDown, true);
    };

    handleMouseDownCapture = (childHandler: (e: React.MouseEvent) => void, e: React.MouseEvent) => {
        if (childHandler != null) {
            childHandler(e);
        }
        this.mouseIsDownOnMe = true;
    };

    handleTouchStartCapture = (childHandler: (e: React.TouchEvent) => void, e: React.TouchEvent) => {
        if (childHandler != null) {
            childHandler(e);
        }
        this.touchIsDownOnMe = true;
    };

    handleTouchend = (e: TouchEvent) => {
        if (!this.touchIsDownOnMe) {
            this.props.onClickOutside(e);
        }
        this.touchIsDownOnMe = false;
    };

    handleMouseUp = (e: MouseEvent) => {
        if (!this.heardMouseDown) {
            return;
        }

        if (e.detail === 0) {
            // the detail property on a click event represents the current click count
            // if this is eq to 0, it means the event did not come from a user click
            // this can happen when a <label> has a for attr. when the label is clicked
            // the browser will trigger a click event on the linked input as well
            return;
        }

        if (!this.mouseIsDownOnMe) {
            this.props.onClickOutside(e);
        }

        this.mouseIsDownOnMe = false;
    };

    render() {
        const child = React.Children.only(this.props.children) as React.ReactElement<any>;

        const props = {
            ...child.props,
            onMouseDownCapture: this.handleMouseDownCapture.bind(this, child.props.onMouseDownCapture),
            onTouchStartCapture: this.handleTouchStartCapture.bind(this, child.props.onTouchStartCapture),
        };

        return React.cloneElement(child, props);
    }
}
