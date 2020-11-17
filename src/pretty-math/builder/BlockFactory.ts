import { action } from 'mobx';
import {
    Block,
    BlockState,
    IBlockConfig,
    invariant,
    MathRootBlock,
    RootBlock,
} from 'pretty-math/internal';

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
