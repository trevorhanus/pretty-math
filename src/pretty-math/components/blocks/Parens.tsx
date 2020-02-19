import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { EditableEngine, LeftParensBlock, RightParensBlock } from 'pretty-math/internal';
import { Block } from 'pretty-math/components';

export interface IParensProps {
    block: RightParensBlock | LeftParensBlock;
    engine?: EditableEngine;
}

export const Parens = inject('engine')(observer((props: IParensProps) => {
    const { engine, block } = props;
    const style: React.CSSProperties = {};

    if (engine.hasFocus) {
        style.color = block.rgbColor;
    }

    return (
        <Block block={block} style={style} />
    );
}));
