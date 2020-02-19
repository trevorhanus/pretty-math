import classNames from 'classnames';
import isEqual from 'lodash.isequal';
import { MathContext } from 'math';
import { action } from 'mobx';
import { Portal } from 'mobx-portals';
import { observer, Provider } from 'mobx-react';
import { MathRoot, Textarea } from 'pretty-math/components';
import { BlockUtils, Dir, EditableEngine, MathFieldState } from 'pretty-math/internal';
import * as React from 'react';

export interface IEditableFieldProps<EngineType> {
    assistant?: React.ReactNode
    boundingViewport?: HTMLElement;
    className?: string;
    disabled?: boolean;
    engine: EditableEngine & EngineType;
    focusOnMount?: boolean;
    mathContext?: MathContext;
    state?: MathFieldState;
    onBlur?: () => void;
    onCancel?: () => void;
    onCursorLeave?: (dir: Dir) => void;
    onDeleteOutOf?: (dir: Dir) => void;
    onChange?: (state: MathFieldState) => void;
    onFocus?: () => void;
    onInit?: (engine: EditableEngine & EngineType) => void;
    onSubmit?: (state: MathFieldState) => void;
}

@observer
export class EditableField<EngineType> extends React.Component<IEditableFieldProps<EngineType>, {}> {
    cancelOnBlur: boolean;
    engine: EditableEngine & EngineType;

    constructor(props: IEditableFieldProps<EngineType>) {
        super(props);
        this.cancelOnBlur = false;
        this.engine = props.engine;
        this.initEngine(this.props);
    }

    @action
    initEngine(props: IEditableFieldProps<EngineType>) {
        this.engine.init(props);
        this.props.onInit && this.props.onInit(this.engine);
    }

    componentDidCatch(e) {
        console.log('[EditableField] ', e.message);
    }

    componentDidMount() {
        if (this.engine.focusOnMount) {
            this.engine.focus();
        }
        this.engine.focusOnMount = false;
    }

    @action
    componentWillReceiveProps(newProps: IEditableFieldProps<EngineType>) {
        const newFieldState = newProps.state;

        if (newFieldState === undefined) {
            // nothing to do
            return;
        }

        if (newFieldState === null) {
            // really want to start fresh
            this.engine.clear();
            return;
        }

        const fieldStateIsDifferentThanEngineState = !isEqual(newFieldState.root, this.engine.toJS().root);

        if (fieldStateIsDifferentThanEngineState) {
            // these are really helpful for debugging, so i'm gonna leave them
            // commented out
            // console.log('newFieldState does not equal what is in engine.');
            // console.log('incoming fieldState');
            // console.log(JSON.stringify(newFieldState.root, null, 2));
            // console.log('engine state');
            // console.log(JSON.stringify(this.engine.toJS().root, null, 2));
            this.engine.init(newProps);
        }
    }

    componentWillUnmount() {
        this.engine.kill();
    }

    render() {
        const { engine } = this;
        
        return (
            <Provider engine={engine}>
                <div
                    className={this.className}
                    ref={ref => this.engine.setFieldRef(ref)}
                    onDoubleClick={this.props.disabled ? null : this.handleDblClick }
                    onMouseDown={this.props.disabled ? null : this.handleMouseDown }
                >
                    <Portal id={engine.overlayPortalKey} className="overlay-portal" />
                    <MathRoot rootBlock={engine.root} />
                    { this.props.assistant }
                    <Textarea
                        onRef={this.setTextareaRef}
                        onBlur={this.handleBlur}
                        onFocus={this.handleFocus}
                        onInput={this.handleInput}
                        onBackspace={this.handleBackspace}
                        onDelete={this.handleDelete}
                        onEscape={this.handleEscape}
                        onReturn={this.handleReturn}
                        onSelAll={this.handleSelAll}
                        onTab={this.handleTab}
                        onCopy={this.handleCopy}
                        onCut={this.handleCut}
                        onPaste={this.handlePaste}
                        onDown={this.handleDown}
                        onLeft={this.handleLeft}
                        onRight={this.handleRight}
                        onUp={this.handleUp}
                        onRedo={this.handleRedo}
                        onUndo={this.handleUndo}
                    />
                </div>
            </Provider>
        );
    }

    get className(): string {
        const { engine, className } = this.props;

        return classNames(
            className,
            'math-field math',
            { focused: engine.hasFocus },
        );
    }

    @action
    handleBlur = (e: React.FocusEvent) => {
        if (this.cancelOnBlur && this.props.onCancel != null) {
            // user hit escape to cancel
            this.props.onCancel();
        } else if (!this.cancelOnBlur && this.props.onSubmit != null) {
            const state = this.engine.toJS();
            this.props.onSubmit(state);
        }

        this.cancelOnBlur = false;

        this.engine.handleTextareaBlur();
        this.props.onBlur && this.props.onBlur();
    };

    handleChange = (state: MathFieldState) => {
        if (this.props.onChange) {
            this.props.onChange(state);
        }
    };

    @action
    handleDblClick = () => {
        this.engine.handler.selectAll();
    };

    @action
    handleFocus = () => {
        this.engine.handleTextareaFocus();
        this.props.onFocus && this.props.onFocus();
    };

    handleInput = (e: React.ChangeEvent, val: string) => {
        this.engine.handler.insertText(val);
    };

    handleBackspace = (e: React.KeyboardEvent) => {
        if (e.metaKey) {
            return this.engine.handler.backspaceAll();
        }
        this.engine.handler.backspace();
    };

    handleDelete = () => {
        this.engine.handler.delete();
    };

    handleEscape = () => {
        this.cancelOnBlur = true;
        this.engine.blur();
    };

    handleReturn = (e: React.KeyboardEvent) => {
        this.engine.handler.return();
    };

    handleSelAll = (e: React.KeyboardEvent) => {
        this.engine.handler.selectAll();
    };

    handleTab = (e: React.KeyboardEvent) => {
        this.engine.handler.tab(e);
    };

    handleCopy = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const { selection } = this.engine;
        const text = BlockUtils.getCalchubForRange(selection.selectedRange);
        if (text != null && text !== '') {
            e.clipboardData.setData('text/plain', text);
        }
    };

    handleCut = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const { selection } = this.engine;
        const text = BlockUtils.getCalchubForRange(selection.selectedRange);
        if (!selection.isCollapsed) {
            this.engine.handler.backspace();
        }
        if (text != null && text !== '') {
            e.clipboardData.setData('text/plain', text);
        }
    };

    handlePaste = (e: React.ClipboardEvent, data: string) => {
        this.engine.handler.pasteData(data);
    };

    handleDown = (e: React.KeyboardEvent) => {
        switch (true) {
            case e.metaKey:
                return this.engine.handler.moveSelectionToEnd();
            case e.shiftKey:
                return this.engine.handler.selectDown();
            default:
                this.engine.handler.down();
        }
    };

    handleLeft = (e: React.KeyboardEvent) => {
        switch (true) {
            case e.metaKey && e.shiftKey:
                return this.engine.handler.selectToStart();
            case e.metaKey:
                return this.engine.handler.moveSelectionToStart();
            case e.shiftKey:
                return this.engine.handler.selectLeft();
            default:
                this.engine.handler.left();
        }
    };

    handleRight = (e: React.KeyboardEvent) => {
        switch (true) {
            case e.metaKey && e.shiftKey:
                return this.engine.handler.selectToEnd();
            case e.metaKey:
                return this.engine.handler.moveSelectionToEnd();
            case e.shiftKey:
                return this.engine.handler.selectRight();
            default:
                this.engine.handler.right();
        }
    };

    handleUp = (e: React.KeyboardEvent) => {
        switch (true) {
            case e.metaKey:
                return this.engine.handler.moveSelectionToStart();
            case e.shiftKey:
                return this.engine.handler.selectUp();
            default:
                this.engine.handler.up();
        }
    };

    handleRedo = (e: React.KeyboardEvent) => {
        e.preventDefault();
        e.stopPropagation();
        this.engine.redo();
    };

    handleUndo = (e: React.KeyboardEvent) => {
        e.preventDefault();
        e.stopPropagation();
        this.engine.undo();
    };

    handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();

        const blockData = (e.nativeEvent as any).blockData;
        if (blockData) {
            const { block, offset } = blockData;
            this.engine.selection.anchorAt({ block, offset });
        } else {
            this.engine.handler.moveSelectionToEnd();
        }

        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseup', this.handleMouseUp);

        if (!this.engine.hasFocus) {
            this.engine.focus();
        }
    };

    handleMouseMove = (e: MouseEvent) => {
        const blockData = (e as any).blockData;
        if (blockData) {
            const { block, offset } = blockData;
            this.engine.selection.focusTo({ block, offset });
        }
    };

    handleMouseUp = (e: MouseEvent) => {
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.handleMouseUp);
    };

    setTextareaRef = (ref: HTMLTextAreaElement) => {
        this.engine.setHiddenTextareaRef(ref);
    };
}
