import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { EditableEngine } from 'pretty-math/internal';
import { DifferentialBlock } from 'pretty-math/blocks/DifferentialBlock';
import { BlockWrapper } from 'pretty-math/components/blocks/BlockWrapper';
import { RenderChain, RenderStaticChain } from 'pretty-math/components/blocks/RenderChain';
import { Cursor } from 'pretty-math/components/Cursor';

export interface IDifferentialProps {
    block: DifferentialBlock;
    engine?: EditableEngine;
}

@inject('engine')
@observer
export class Differential extends React.Component<IDifferentialProps, {}> {

    constructor(props: IDifferentialProps) {
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
                    <span className="differential">
                        <span>{block.text}</span>
                        <span className={innerClasses}>
                            <RenderChain startBlock={block.inner} />
                        </span>
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

export interface IStaticDifferentialProps {
    block: DifferentialBlock;
}

export const StaticDifferential = observer((props: IStaticDifferentialProps) => {
    const { block } = props;

    return (
        <span className="differential">
            <span>{block.text}</span>
            <span className="inner">
                <RenderStaticChain start={block.inner} />
            </span>
        </span>
    );
});
