export * from './interfaces';
export * from './utils';

export * from './model/BlockList';
export * from './model/Block';
export * from './model/RootBlock';
export * from './model/Editor';
export * from './model/EditorController';

export * from './history/History';

// selection
export * from './selection/BlockPosition';
export * from './selection/CursorPositioner';
export * from './selection/Selection';
export * from './selection/SelectionRange';

// assistant
export * from './assistant';

// components
export * from './components/Content';
export * from './components/Cursor';
export * from './components/PrettyMathInput'
export * from './components/PrettyMathStatic';

// handlers
export * from './handlers/handleCopy';
export * from './handlers/handleCut';
export * from './handlers/handleDelete';
export * from './handlers/handleEnterPressed';
export * from './handlers/handleExpandSelection';
export * from './handlers/handleMoveCursor';
export * from './handlers/handlePaste';
export * from './handlers/handleTextareaChange';
export * from './handlers/defaultCommandHandler';

// keybindings
export * from './keybindings/defaultKeyBindingFn';

import { BlockFactory } from './builder/BlockFactory';
export { BlockFactory }

// builder
export * from './builder/NodeToBlock';
export * from './builder/TokenToBuilder';
export * from './builder/blocksFromNodeTree';

export * from './blocks/AtomicBlock';
export * from './blocks/DerivativeBlock';
export * from './blocks/DifferentialBlock';
export * from './blocks/EndBlock';
export * from './blocks/FractionBlock';
export * from './blocks/FunctionBlock';
export * from './blocks/IntegralBlock';
export * from './blocks/LeftParenBlock';
export * from './blocks/MathRootBlock';
export * from './blocks/MathSymbolBlock';
export * from './blocks/ParagraphBlock';
export * from './blocks/RadicalBlock';
export * from './blocks/RightParenBlock';
export * from './blocks/RootBlock';
export * from './blocks/SupSubBlock';

import { atomicBlockConfig } from './blocks/AtomicBlock';
import { derivativeBlockConfig } from './blocks/DerivativeBlock';
import { differentialBlockConfig } from './blocks/DifferentialBlock';
import { endBlockConfig } from './blocks/EndBlock';
import { fractionBlockConfig } from './blocks/FractionBlock';
import { functionBlockConfig } from './blocks/FunctionBlock';
import { integralBlockConfig } from './blocks/IntegralBlock';
import { leftParenBlockConfig } from './blocks/LeftParenBlock';
import { mathRootBlockConfig } from './blocks/MathRootBlock';
import { mathSymbolBlockConfig } from './blocks/MathSymbolBlock';
import { paragraphBlockConfig } from './blocks/ParagraphBlock';
import { radicalBlockConfig } from './blocks/RadicalBlock';
import { rightParenBlockConfig } from './blocks/RightParenBlock';
import { rootBlockConfig } from './blocks/RootBlock';
import { supSubBlockConfig } from './blocks/SupSubBlock';

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
