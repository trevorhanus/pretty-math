import { Block, BlockState } from '../model';
import { blankBlockConfig } from './BlankBlock';
import { paragraphBlockConfig } from './ParagraphBlock';
import { textBlockConfig } from './TextBlock';
import { functionBlockConfig } from './FunctionBlock';
import { fractionBlockConfig } from './FractionBlock';

const blocks = {};

blocks[blankBlockConfig.type] = blankBlockConfig;
blocks[fractionBlockConfig.type] = fractionBlockConfig;
blocks[functionBlockConfig.type] = functionBlockConfig;
blocks[paragraphBlockConfig.type] = paragraphBlockConfig;
blocks[textBlockConfig.type] = textBlockConfig;

export function createBlock(type: string, state?: Partial<BlockState>): Block {
    const config = blocks[type];
    return new Block(config, state);
}
