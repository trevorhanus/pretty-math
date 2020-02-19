import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { EditableEngine, FunctionBlock } from 'pretty-math/internal';
import { BlockWrapper, Cursor, FunctionName, RenderChain, RenderStaticChain } from 'pretty-math/components';

export interface IFunctionBlock {
    block: FunctionBlock;
    engine?: EditableEngine;
}

@inject('engine')
@observer
export class Function extends React.Component<IFunctionBlock, {}> {

    constructor(props: IFunctionBlock) {
        super(props);
    }

    render() {
        const { block } = this.props;

        const innerClasses = classNames(
            'inner',
            { outline: this.isFocusOnInner() }
        );

        return (
            <>
                <Cursor block={block} offset={0} />
                <BlockWrapper block={block}>
                    <span className="function">
                        <FunctionName name={block.text} />
                        <span>(</span>
                        <span className={innerClasses}>
                            <RenderChain startBlock={block.inner} />
                        </span>
                        <span>)</span>
                    </span>
                </BlockWrapper>
                <Cursor block={block} offset={1} />
            </>
        );
    }

    isFocusOnInner(): boolean {
        const { block, engine } = this.props;
        return block.inner.containsShallow(engine.selection.focus.block);
    }
}

export interface IStaticFunctionProps {
    block: FunctionBlock;
}

export const StaticFunction = observer((props: IStaticFunctionProps) => {
    const { block } = props;
    const decor = block.decor;

    return (
        <span className="function">
            <span className="function-name">
                { decor.displayValueOverride || block.text }
            </span>
            <span>(</span>
            <span className="inner">
                <RenderStaticChain start={block.inner} />
            </span>
            <span>)</span>
        </span>
    );
});
