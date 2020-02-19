import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { EditableEngine, IBlock } from 'pretty-math/internal';

export interface ICursorProps {
    block: IBlock;
    offset: number;
    engine?: EditableEngine;
}

export const Cursor = inject('engine')(observer((props: ICursorProps) => {
    const { block, offset } = props;

    const { selection } = props.engine;

    if (!selection.hasFocus(block) || selection.focus.offset !== offset) {
        return null;
    }

    return (
        <span className="cursor">&#65279;</span>
    );
}));
