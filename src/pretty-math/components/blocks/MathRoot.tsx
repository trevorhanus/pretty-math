import { observer } from 'mobx-react';
import * as React from 'react';
import { RootBlock } from 'pretty-math/internal';
import { RenderChain, RenderStaticChain } from 'pretty-math/components';

export interface IMathRootProps {
    rootBlock: RootBlock;
}

export const MathRoot = observer((props: IMathRootProps) => {
    const { chainStart } = props.rootBlock;

    return (
        <span className="math-root">
            <RenderChain startBlock={chainStart} />
        </span>
    );
});

export interface IStaticMathRootProps {
    rootBlock: RootBlock;
    fontSize?: number;
}

export const StaticMathRoot = observer((props: IStaticMathRootProps) => {
    const { chainStart } = props.rootBlock;

    return (
        <span
            className="math-root"
            style={{ fontSize: props.fontSize }}
        >
            <RenderStaticChain start={chainStart} />
        </span>
    );
});
