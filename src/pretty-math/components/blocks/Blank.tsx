import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { BlankBlock, EditableEngine } from 'pretty-math/internal';
import { BlockWrapper, Cursor } from 'pretty-math/components';

export interface IBlankProps {
    block: BlankBlock;
    engine?: EditableEngine;
}

export const Blank = inject('engine')(observer((props: IBlankProps) => {
    const { block, engine } = props;

    const classes = classNames(
        'block blank',
        { 'no-cursor': engine.selection.focus.block !== block },
    );

    return (
        <>
            <Cursor block={block} offset={0} />
            <Cursor block={block} offset={1} />
            <BlockWrapper block={block}>
                <span className={classes} />
            </BlockWrapper>
        </>
    );
}));

export interface IStaticBlankProps {
}

export const StaticBlank = observer((props: IStaticBlankProps) => {
    return <span className="block static-blank" />;
});
