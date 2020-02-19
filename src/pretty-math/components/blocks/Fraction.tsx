import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { EditableEngine, FractionBlock } from 'pretty-math/internal';
import { BlockWrapper, Cursor, RenderChain, RenderStaticChain } from 'pretty-math/components';

export interface IFractionProps {
    block: FractionBlock;
    engine?: EditableEngine;
}

export const Fraction = observer((props: IFractionProps) => {
    const { block } = props;

    return (
        <>
            <Cursor block={block} offset={0} />
            <BlockWrapper block={block}>
                <span
                    className="fraction"
                >
                    <Numerator {...props} />
                    <span className="fraction-line">
                        <span className="line" />
                    </span>
                    <Denominator {...props} />
                </span>
            </BlockWrapper>
            <Cursor block={block} offset={1} />
        </>
    );
});

export const Numerator = inject('engine')(observer((props: IFractionProps) => {
    const { block, engine } = props;
    const focusIsOnInner = block.num.containsShallow(engine.selection.focus.block);
    const classes = classNames(
        'numerator',
        { outline: focusIsOnInner },
    );

    return (
        <span className={classes}>
            <RenderChain startBlock={block.num} />
        </span>
    );
}));

export const Denominator = inject('engine')(observer((props: IFractionProps) => {
    const { block, engine } = props;
    const focusIsOnInner = block.denom.containsShallow(engine.selection.focus.block);
    const classes = classNames(
        'denominator',
        { outline: focusIsOnInner },
    );

    return (
        <span className={classes}>
            <RenderChain startBlock={block.denom} />
        </span>
    );
}));

export interface IStaticFractionProps {
    block: FractionBlock;
}

export const StaticFraction = observer((props: IStaticFractionProps) => {
    const { block } = props;

    return (
        <span className="fraction">
            <span className="numerator">
                <RenderStaticChain start={block.num} />
            </span>
            <span className="fraction-line">
                <span className="line" />
            </span>
            <span className="denominator">
                <RenderStaticChain start={block.denom} />
            </span>
        </span>
    );
});
