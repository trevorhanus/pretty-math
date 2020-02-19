import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { EditableEngine, IntegralBlock } from 'pretty-math/internal';
import { BlockWrapper, Cursor, RenderChain, RenderStaticChain } from 'pretty-math/components';

export interface IIntegralProps {
    block: IntegralBlock;
    engine?: EditableEngine;
}

@inject('engine')
@observer
export class Integral extends React.Component<IIntegralProps, {}> {

    constructor(props: IIntegralProps) {
        super(props);
    }

    render() {
        const { block } = this.props;

        return (
            <>
                <Cursor block={block} offset={0} />
                <BlockWrapper block={block}>
                    <span className="integral">
                        <span className='integral-symbol'>
                            <span>∫</span>
                        </span>
                        <span className="integral-bounds">
                            <span className="right-bound">
                                <RenderChain startBlock={block.rightBound} />
                            </span>
                            <span className="left-bound">
                                <RenderChain startBlock={block.leftBound} />
                            </span>
                        </span>
                        <span className="inner">
                            <RenderChain startBlock={block.inner} />
                        </span>
                        <span className="wrt">
                            <span>d</span>
                            <RenderChain startBlock={block.wrt} />
                        </span>
                    </span>
                </BlockWrapper>
                <Cursor block={block} offset={1} />
            </>
        );
    }
}

export interface IStaticIntegralProps {
    block: IntegralBlock;
}

export const StaticIntegral = observer((props: IStaticIntegralProps) => {
    const { block } = props;

    return (
        <span className="integral">
            <span className='integral-symbol'>
                <span>∫</span>
            </span>
            <span className="integral-bounds">
                <span className="right-bound">
                    <RenderStaticChain start={block.rightBound} />
                </span>
                <span className="left-bound">
                    <RenderStaticChain start={block.leftBound} />
                </span>
            </span>
            <span className="inner">
                <RenderStaticChain start={block.inner} />
            </span>
            <span className="wrt">
                <span>d</span>
                <RenderStaticChain start={block.wrt} />
            </span>
        </span>
    );
});
