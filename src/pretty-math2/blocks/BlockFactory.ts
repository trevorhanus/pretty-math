import { action } from 'mobx';
import { IBlockConfig } from '../interfaces';
import { Block, BlockState, RootBlock } from '../model';
import { atomicBlockConfig } from './AtomicBlock';
import { endBlockConfig } from './EndBlock';
import { fractionBlockConfig } from './FractionBlock';
import { functionBlockConfig } from './FunctionBlock';
import { mathRootBlockConfig } from './MathRootBlock';
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
    return new Block(config, data, id);
});

const createRootBlock = action((type: string): RootBlock => {
    const config = blocks[type];
    return new RootBlock(config);
});

const createBlockFromState = action((state: BlockState): Block => {
    const { type } = state;

    if (!type) {
        throw new Error('no type in block state');
    }

    if (type.startsWith('root')) {
        return createRootBlock(type);
    }

    const block = createBlock(type, state.data, state.id);

    const childrenState = state.children || {};

    for (let childName in block.children) {
        const list = block.children[childName];
        const listState = childrenState[childName];
        if (listState && listState.length > 0) {
        }
    }

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
    rootBlockConfig,
    supSubBlockConfig,
].forEach(config => BlockFactory.addBlockType(config));
