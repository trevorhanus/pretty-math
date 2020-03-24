import { action } from 'mobx';
import { IBlockConfig } from '../interfaces';
import { Block, BlockState, RootBlock } from '../model';
import { invariant } from '../utils/invariant';
import { atomicBlockConfig } from './AtomicBlock';
import { endBlockConfig } from './EndBlock';
import { fractionBlockConfig } from './FractionBlock';
import { functionBlockConfig } from './FunctionBlock';
import { mathRootBlockConfig } from './MathRootBlock';
import { mathSymbolBlockConfig } from './MathSymbolBlock';
import { paragraphBlockConfig } from './ParagraphBlock';
import { rootBlockConfig } from './RootBlock';
import { supSubBlockConfig } from './SupSubBlock';

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
    return new Block(config, data, id);
});

const createRootBlock = action((type: string): RootBlock => {
    const config = blocks[type];
    invariant(!config, `Could not find config for block type '${type}'.`);
    return new RootBlock(config);
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
    createRootBlock,
};

// Add the default block types

[
    atomicBlockConfig,
    endBlockConfig,
    fractionBlockConfig,
    functionBlockConfig,
    paragraphBlockConfig,
    mathRootBlockConfig,
    mathSymbolBlockConfig,
    rootBlockConfig,
    supSubBlockConfig,
].forEach(config => BlockFactory.addBlockType(config));
