import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { DefineFunctionBlock, EditableEngine } from 'pretty-math/internal';
import { BlockWrapper, Cursor, RenderChain, RenderStaticChain } from 'pretty-math/components';

export interface IUserDefinedFunctionProps {
    block: DefineFunctionBlock;
    engine?: EditableEngine;
}

@inject('engine')
@observer
export class UserDefinedFunction extends React.Component<IUserDefinedFunctionProps, {}> {

    constructor(props: IUserDefinedFunctionProps) {
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
                        <span className="function-name">
                            <RenderStaticChain start={block.funcName} />
                        </span>
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

export interface IStaticUserDefinedFunctionProps {
    block: DefineFunctionBlock;
}

export const StaticUserDefinedFunction = observer((props: IStaticUserDefinedFunctionProps) => {
    const { block } = props;

    return (
        <span className="function">
            <span className="function-name">
                <RenderStaticChain start={block.funcName} />
            </span>
            <span>(</span>
            <span className="inner">
                <RenderStaticChain start={block.inner} />
            </span>
            <span>)</span>
        </span>
    );
});
