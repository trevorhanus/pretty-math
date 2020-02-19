import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { MathEngine } from 'pretty-math/internal';
import { ExprEvaluationBlock } from 'pretty-math/blocks/ExprEvaluationBlock';
import { BlockWrapper } from 'pretty-math/components/blocks/BlockWrapper';
import { Cursor } from 'pretty-math/components/Cursor';

export interface IExprEvaluationProps {
    block: ExprEvaluationBlock;
    engine?: MathEngine;
}

export const ExprEvaluation = inject('engine')(observer((props: IExprEvaluationProps) => {
    const { block, engine } = props;

    if (engine.mathExpr) {
        console.log('got math expr: ', engine.mathExpr);
    }

    return (
        <>
            <Cursor block={block} offset={0} />
            <BlockWrapper block={block}>
                <span>
                    <span className="block binary-op">=</span>
                    <span>12.3543</span>
                </span>
            </BlockWrapper>
            <Cursor block={block} offset={1} />
        </>
    );
}));

export interface IStaticExprEvaluationProps {
    block: ExprEvaluationBlock;
}

export const StaticExprEvaluation = observer((props: IStaticExprEvaluationProps) => {
    const { block } = props;

    return (
        <>
            <BlockWrapper block={block}>
                <span>
                    <span className="block">=</span>
                    <span>12.3543</span>
                </span>
            </BlockWrapper>
            <Cursor block={block} offset={1} />
        </>
    );
});
