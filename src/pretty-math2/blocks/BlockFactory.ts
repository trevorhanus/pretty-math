import { action } from 'mobx';
import { IBlockConfig } from '../interfaces';
import { Block, BlockState, MathRootBlock, RootBlock } from '../model';
import { invariant } from '../utils/invariant';
import { atomicBlockConfig } from './AtomicBlock';
import { endBlockConfig } from './EndBlock';
import { fractionBlockConfig } from './FractionBlock';
import { functionBlockConfig } from './FunctionBlock';
import { leftParenBlockConfig } from './LeftParenBlock';
import { mathRootBlockConfig } from './MathRootBlock';
import { mathSymbolBlockConfig } from './MathSymbolBlock';
import { paragraphBlockConfig } from './ParagraphBlock';
import { rightParenBlockConfig } from './RightParenBlock';
import { rootBlockConfig } from './RootBlock';
import { supSubBlockConfig } from './SupSubBlock';
import { radicalBlockConfig } from './RadicalBlock';
import { integralBlockConfig } from './IntegralBlock';
import { derivativeBlockConfig } from './DerivativeBlock';
import { differentialBlockConfig } from './DifferentialBlock';

const blocks: { [type: string]: IBlockConfig<Block> } = {};

const addBlockType = (config: IBlockConfig<Block>) => {
    verifyBlockConfig(config);

    if (blocks[config.type]) {
        throw new Error(`Duplicate blocks type: '${config.type}'`);
    }

    blocks[config.type] = config;
};

const createBlock = action((type: string, data?: any, id?: string): Block => {
    const config = blocks[type];
    invariant(!config, `Could not find config for block type '${type}'.`);

    // blocks with special Constructors
    if (type === 'root:math') {
        return new MathRootBlock(config, data, id);
    }

    if (type.startsWith('root')) {
        return new RootBlock(config, data, id);
    }

    return new Block(config, data, id);
});

const createBlockFromState = action((state: BlockState): Block => {
    const block = createBlock(state.type, state.data, state.id);
    block.applyState(state);
    return block;
});

function verifyBlockConfig(config: IBlockConfig<any>) {
    return;
}

export const BlockFactory = {
    addBlockType,
    createBlock,
    createBlockFromState,
};

// Add the default block types

const DEFAULT_BLOCKS = [
    atomicBlockConfig,
    derivativeBlockConfig,
    differentialBlockConfig,
    endBlockConfig,
    fractionBlockConfig,
    functionBlockConfig,
    integralBlockConfig,
    leftParenBlockConfig,
    paragraphBlockConfig,
    mathRootBlockConfig,
    mathSymbolBlockConfig,
    radicalBlockConfig,
    rightParenBlockConfig,
    rootBlockConfig,
    supSubBlockConfig,
];

DEFAULT_BLOCKS.forEach(config => BlockFactory.addBlockType(config));
