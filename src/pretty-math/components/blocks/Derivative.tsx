import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { DerivativeBlock, EditableEngine } from 'pretty-math/internal';
import { BlockWrapper } from 'pretty-math/components/blocks/BlockWrapper';
import { RenderChain, RenderStaticChain } from 'pretty-math/components/blocks/RenderChain';
import { Cursor } from 'pretty-math/components/Cursor';

export interface IDerivativeProps {
    block: DerivativeBlock;
    engine?: EditableEngine;
}

@inject('engine')
@observer
export class Derivative extends React.Component<IDerivativeProps, {}> {

    constructor(props: IDerivativeProps) {
        super(props);
    }

    render() {
        const { block } = this.props;

        const innerClasses = classNames(
            'inner',
            { outline: this.isFocusOnInner() },
        );

        return (
            <>
                <Cursor block={block} offset={0} />
                <BlockWrapper block={block}>
                    <span className="derivative">
                        <span className="fraction">
                            <span className="numerator">
                                <span className="block italic">{block.topDDisplayValue}</span>
                                {
                                    block.derivativeOrder > 1 && (
                                        <span className="sup-sub">
                                            <span className="sup">
                                                <span className="block">{block.derivativeOrder}</span>
                                            </span>
                                            <span className="middle-base">
                                                <span className="inline" />
                                            </span>
                                        </span>
                                    )
                                }
                            </span>
                            <span className="fraction-line"><span className="line" /></span>
                            <Wrt {...this.props} />
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
        )
    }

    isFocusOnInner(): boolean {
        const { block, engine } = this.props;
        return block.inner.containsShallow(engine.selection.focus.block);
    }
}

export const Wrt = inject('engine')(observer((props: IDerivativeProps) => {
    const { block, engine } = props;

    const focusIsOnInner = block.wrt.containsShallow(engine.selection.focus.block);

    const classes = classNames(
        'denominator',
        { outline: focusIsOnInner },
    );

    return (
        <span className={classes}>
            <RenderChain startBlock={block.wrt} />
        </span>
    );
}));

export interface IStaticDerivativeProps {
    block: DerivativeBlock;
}

export const StaticDerivative = observer((props: IStaticDerivativeProps) => {
    const { block } = props;

    return (
        <span className="derivative">
            <span className="fraction">
                <span className="numerator">
                    <span className="block italic">{block.topDDisplayValue}</span>
                    {
                        block.derivativeOrder > 1 && (
                            <span className="sup-sub">
                                <span className="sup">
                                    <span className="block">{block.derivativeOrder}</span>
                                </span>
                                <span className="middle-base">
                                    <span className="inline" />
                                </span>
                            </span>
                        )
                    }
                </span>
                <span className="fraction-line"><span className="line" /></span>
                <span className="denominator">
                    <RenderStaticChain start={block.wrt} />
                </span>
            </span>
            <span>(</span>
            <span className="inner">
                <RenderStaticChain start={block.inner} />
            </span>
            <span>)</span>
        </span>
    );
});
