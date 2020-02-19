import { fromHex, splitUnicodeString } from 'common';
import {
    BlankBlock,
    Block,
    BlockChainState,
    BlockType,
    buildChainFromCalchub,
    calchubFromChain,
    DefineFunctionBlock,
    DerivativeBlock,
    DifferentialBlock,
    exhausted,
    ExprEvaluationBlock,
    FractionBlock,
    FunctionBlock,
    IBlock,
    IBlockState,
    IntegralBlock,
    latexToEntryMap,
    LeftParensBlock,
    MatrixBlock,
    RadicalBlock,
    RightParensBlock,
    RootBlock,
    SupSubBlock,
} from 'pretty-math/internal';

export function blank(): BlankBlock {
    return new BlankBlock();
}

export function buildSupSub(sup?: IBlock, sub?: IBlock): IBlock {
    sub = parsePossibleHexChain(sub);
    const supSub = new SupSubBlock();
    supSub.setSup(sup);
    supSub.setSub(sub);
    return supSub;
}

export function chainFromString(text: string): IBlock {
    if (text == null || text === '') {
        return null;
    }

    // we need to find \ (backslashes)
    const chars = splitUnicodeString(text);

    let i = 0;
    let chain = null;
    let latexCmd = null;

    while (i < chars.length) {
        let block = null;
        const char = chars[i];

        if (latexCmd && (char === '\\' || char === ' ')) {
            // finish up latex command
            chain = reduceChains([chain, blockFromLatexCmd(latexCmd)]);
            latexCmd = null;
        }

        if (!latexCmd && char === '\\') {
            latexCmd = char;
            i++;
            continue;
        }

        if (latexCmd && char !== '\\' && char !== ' ') {
            latexCmd += char;
            i++;
            continue;
        }

        block = new Block(char);
        chain = reduceChains([chain, block]);
        i++;
    }

    // clean up if we have a latex command
    if (latexCmd) {
        chain = reduceChains([chain, blockFromLatexCmd(latexCmd)]);
        latexCmd = null;
    }

    return chain.chainStart;
}

export function blockFromLatexCmd(cmd: string): IBlock {
    const entry = latexToEntryMap[cmd];

    if (!entry) {
        return null;
    }

    return new Block(entry.text, entry.latex);
}

export function reduceChains(chains: IBlock[]): IBlock {
    if (!chains || chains.length === 0) {
        return null;
    }

    const chain = chains.reduce((prev, cur) => {
        if (prev == null) {
            return cur;
        }

        if (cur == null) {
            return prev;
        }

        prev.chainEnd.insertChainRight(cur.chainStart);
        return prev.chainEnd;
    });

    return chain && chain.chainStart;
}

/**
 * a hex chain will always start with an 'x' which
 * will be followed by a valid hex string
 *
 * eg: 'x007b0061007d'
 *
 */

export function parsePossibleHexChain(chain: IBlock): IBlock {
    if (chain == null) {
        return null;
    }

    const text = calchubFromChain(chain);

    if (text.length >= 5 && text.startsWith('x')) {
        const decoded = fromHex(text.slice(1));
        return buildChainFromCalchub(decoded);
    } else {
        return chain;
    }
}

/**
 * From JS
 */

export function fromJS(js: IBlockState | BlockChainState): IBlock {
    if (Array.isArray(js)) {
        const blocks = js.map(state => fromJS(state));
        return reduceChains(blocks);
    }

    switch (js.type) {

        case BlockType.Blank:
            return new BlankBlock(js.id);

        case BlockType.Block:
            return Block.fromJS(js);

        case BlockType.Derivative:
            return DerivativeBlock.fromJS(js);

        case BlockType.Differential:
            return DifferentialBlock.fromJS(js);

        case BlockType.ExprEval:
            return new ExprEvaluationBlock(js.id);

        case BlockType.Fraction:
            return FractionBlock.fromJS(js);

        case BlockType.Function:
            return FunctionBlock.fromJS(js);

        case BlockType.Integral:
            return IntegralBlock.fromJS(js);

        case BlockType.LeftParens:
            return LeftParensBlock.fromJS(js);

        case BlockType.Matrix:
            return MatrixBlock.fromJS(js);

        case BlockType.Radical:
            return RadicalBlock.fromJS(js);

        case BlockType.RightParens:
            return RightParensBlock.fromJS(js);

        case BlockType.Root:
            return RootBlock.fromJS(js);

        case BlockType.SupSub:
            return SupSubBlock.fromJS(js);

        case BlockType.DefineFunction:
            return DefineFunctionBlock.fromJS(js);

        default:
            console.log(`Could not build block of type '${js.type}'.`);
            console.log(JSON.stringify(js, null, 2));
            exhausted(js.type);
    }
}
