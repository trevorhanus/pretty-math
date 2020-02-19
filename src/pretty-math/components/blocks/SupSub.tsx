import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { EditableEngine, SupSubBlock } from 'pretty-math/internal';
import { BlockWrapper, Cursor, RenderChain, RenderStaticChain } from 'pretty-math/components';

export interface ISupSubProps {
    block: SupSubBlock;
    engine?: EditableEngine;
}

export const SupSub = observer((props: ISupSubProps) => {
    const { block } = props;

    return (
        <>
            <Cursor block={block} offset={0} />
            <BlockWrapper block={block}>
                <span className="sup-sub">
                    <Sup {...props} />
                    <span className="middle-base">
                        <span className="inline" />
                    </span>
                    <Sub {...props} />
                </span>
            </BlockWrapper>
            <Cursor block={block} offset={1} />
        </>
    );
});

const Sup = inject('engine')(observer((props: ISupSubProps) => {
    if (!props.block.sup) {
        return null;
    }

    const { block, engine } = props;

    const focusIsOnInner = block.sup && block.sup.containsShallow(engine.selection.focus.block);
    const classes = classNames(
        'sup',
        { outline: focusIsOnInner },
    );

    return (
        <span className={classes}>
            <RenderChain startBlock={block.sup} />
        </span>
    );
}));

const Sub = inject('engine')(observer((props: ISupSubProps) => {
    if (!props.block.sub) {
        return null;
    }

    const { block, engine } = props;

    const focusIsOnInner = block.sub && block.sub.containsShallow(engine.selection.focus.block);
    const classes = classNames(
        'sub',
        { outline: focusIsOnInner },
    );

    return (
        <span className={classes}>
            <RenderChain startBlock={props.block.sub} />
        </span>
    );
}));

export interface IStaticSupSubProps {
    block: SupSubBlock;
}

export const StaticSupSub = observer((props: IStaticSupSubProps) => {
    const { block } = props;

    return (
        <span className="sup-sub">
            <span className="sup">
                <RenderStaticChain start={block.sup} />
            </span>
            <span className="middle-base">
                <span className="inline" />
            </span>
            <span className="sub">
                <RenderStaticChain start={block.sub} />
            </span>
        </span>
    );
});
