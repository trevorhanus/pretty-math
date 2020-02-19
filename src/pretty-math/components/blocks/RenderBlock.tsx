import { observer } from 'mobx-react';
import * as React from 'react';
import {
    BlankBlock,
    BlockType,
    DefineFunctionBlock,
    DerivativeBlock,
    DifferentialBlock,
    exhausted,
    ExprEvaluationBlock,
    FractionBlock,
    FunctionBlock,
    IBlock,
    IntegralBlock,
    LeftParensBlock,
    MatrixBlock,
    RadicalBlock,
    RightParensBlock,
    RootBlock,
    SupSubBlock,
    warn,
} from 'pretty-math/internal';
import {
    Blank,
    Block,
    Derivative,
    Differential,
    ExprEvaluation,
    Fraction,
    Function,
    Integral,
    Matrix,
    Parens,
    Radical,
    StaticBlank,
    StaticBlock,
    StaticDerivative,
    StaticDifferential,
    StaticExprEvaluation,
    StaticFraction,
    StaticFunction,
    StaticIntegral,
    StaticMatrix,
    StaticRadical,
    StaticSupSub,
    StaticUserDefinedFunction,
    SupSub,
    UserDefinedFunction,
} from 'pretty-math/components';

export interface IRenderBlockProps {
    block: IBlock;
}

export const RenderBlock = observer((props: IRenderBlockProps) => {
    const { block } = props;

    if (block == null) {
        return null;
    }

    switch (block.type) {

        case BlockType.Blank:
            return <Blank block={block as BlankBlock} />;

        case BlockType.Block:
            return <Block block={block} />;

        case BlockType.DefineFunction:
            return <UserDefinedFunction block={block as DefineFunctionBlock} />;

        case BlockType.Derivative:
            return <Derivative block={block as DerivativeBlock} />;

        case BlockType.Differential:
            return <Differential block={block as DifferentialBlock} />;

        case BlockType.ExprEval:
            return <ExprEvaluation block={block as ExprEvaluationBlock} />;

        case BlockType.Fraction:
            return <Fraction block={block as FractionBlock} />;

        case BlockType.Function:
            return <Function block={block as FunctionBlock} />;

        case BlockType.Integral:
            return <Integral block={block as IntegralBlock} />;

        case BlockType.LeftParens:
            return <Parens block={block as LeftParensBlock} />;

        case BlockType.Matrix:
            return <Matrix matrix={block as MatrixBlock} />;

        case BlockType.Radical:
            return <Radical block={block as RadicalBlock} />;

        case BlockType.Root:
            return <RenderBlock block={(block as RootBlock).chainStart} />;

        case BlockType.RightParens:
            return <Parens block={block as RightParensBlock} />;

        case BlockType.SupSub:
            return <SupSub block={block as SupSubBlock} />;

        default:
            exhausted(block.type);
            warn(`could not find view for block type ${block.type}`);
            return null;
    }
});

export interface IRenderStaticBlockProps {
    block: IBlock;
}

export const RenderStaticBlock = observer((props: IRenderStaticBlockProps) => {

    const { block } = props;

    if (block == null) {
        return null;
    }

    switch (block.type) {

        case BlockType.Blank:
            return <StaticBlank />;

        case BlockType.Block:
            return <StaticBlock block={block} />;

        case BlockType.DefineFunction:
            return <StaticUserDefinedFunction block={block as DefineFunctionBlock} />;

        case BlockType.Derivative:
            return <StaticDerivative block={block as DerivativeBlock} />;

        case BlockType.Differential:
            return <StaticDifferential block={block as DifferentialBlock} />;

        case BlockType.ExprEval:
            return <StaticExprEvaluation block={block as ExprEvaluationBlock} />;

        case BlockType.Fraction:
            return <StaticFraction block={block as FractionBlock} />;

        case BlockType.Function:
            return <StaticFunction block={block as FunctionBlock} />;

        case BlockType.Integral:
            return <StaticIntegral block={block as IntegralBlock} />;

        case BlockType.LeftParens:
            return <StaticBlock block={block} />;

        case BlockType.Matrix:
            return <StaticMatrix matrix={block as MatrixBlock} />;

        case BlockType.Radical:
            return <StaticRadical block={block as RadicalBlock} />;

        case BlockType.RightParens:
            return <StaticBlock block={block} />;

        case BlockType.Root:
            return <RenderStaticBlock block={(block as RootBlock).chainStart} />;

        case BlockType.SupSub:
            return <StaticSupSub block={block as SupSubBlock} />;

        default:
            exhausted(block.type);
            return null;
    }
});
