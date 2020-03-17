import { Block, BlockState } from '../model';
import { blankBlockConfig } from './BlankBlock';
import { blockLevelBlockConfig } from './BlockLevelBlock';
import { textBlockConfig } from './TextBlock';

const blocks = {};

blocks[blankBlockConfig.type] = blankBlockConfig;
blocks[blockLevelBlockConfig.type] = blockLevelBlockConfig;
blocks[textBlockConfig.type] = textBlockConfig;

export function createBlock(type: string, state?: Partial<BlockState>): Block {
    const config = blocks[type];
    return new Block(config, state);
}
