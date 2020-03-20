import { Block, BlockState } from '../model';
import { endBlockConfig } from './EndBlock';
import { fractionBlockConfig } from './FractionBlock';
import { functionBlockConfig } from './FunctionBlock';
import { paragraphBlockConfig } from './ParagraphBlock';
import { textBlockConfig } from './TextBlock';

const blocks = {};

blocks[endBlockConfig.type] = endBlockConfig;
blocks[fractionBlockConfig.type] = fractionBlockConfig;
blocks[functionBlockConfig.type] = functionBlockConfig;
blocks[paragraphBlockConfig.type] = paragraphBlockConfig;
blocks[textBlockConfig.type] = textBlockConfig;

export function createBlock(type: string, state?: Partial<BlockState>): Block {
    const config = blocks[type];
    return new Block(config, state);
}
