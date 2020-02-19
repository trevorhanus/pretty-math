import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { EditableEngine, RadicalBlock } from 'pretty-math/internal';
import { BlockWrapper, Cursor, RadicalSymbol, RenderChain, RenderStaticChain } from 'pretty-math/components';

export interface IRadicalProps {
    block: RadicalBlock;
    engine?: EditableEngine;
}

@inject('engine')
@observer
export class Radical extends React.Component<IRadicalProps, {}> {

    constructor(props: IRadicalProps) {
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
                    <span className="radical">
                        <span className={innerClasses}>
                            <RenderChain startBlock={block.inner} />
                        </span>
                        <RadicalSymbol />
                    </span>
                </BlockWrapper>
                <Cursor block={block} offset={1} />
            </>
        );
    }

    isFocusOnInner(): boolean {
        const { block, engine } = this.props;
        return block.innerChain && block.innerChain.containsSurfaceLevel(engine.selection.focus.block);
    }
}

export interface IStaticRadicalProps {
    block: RadicalBlock;
}

export const StaticRadical = observer((props: IStaticRadicalProps) => {
    const { block } = props;

    return (
        <span className="radical">
            <span className="inner">
                <RenderStaticChain start={block.inner} />
            </span>
            <RadicalSymbol />
        </span>
    );
});
