import { observer } from 'mobx-react';
import * as React from 'react';
import { IBlock } from 'pretty-math/internal';
import { RenderBlock, RenderStaticBlock } from 'pretty-math/components';

export interface IRenderChainProps {
    startBlock: IBlock;
}

export const RenderChain = observer((props: IRenderChainProps) => {
    const { startBlock } = props;

    if (startBlock == null) {
        return null;
    }

    return (
        <>
            <RenderBlock block={startBlock} />
            <RenderChain startBlock={startBlock.right} />
        </>
    )
});


export interface IRenderStaticChainProps {
    start: IBlock;
}

export const RenderStaticChain = observer((props: IRenderStaticChainProps) => {
    const { start } = props;

    if (start == null) {
        return null;
    }

    return (
        <>
            <RenderStaticBlock block={start} />
            <RenderStaticChain start={start.right} />
        </>
    )
});
