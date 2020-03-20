import { IBlockConfig } from '../interfaces';
import { Block, BlockState } from './Block';
import { RootBlock as RootBlockType, rootBlockConfig, RootBlockData, RootBlockChildNames } from '../blocks/RootBlock';
import { mathRootBlockConfig } from '../blocks/MathRootBlock';
import { EditorState } from './EditorState';
import { action, computed } from 'mobx';
import { BlockPosition } from 'pretty-math2/selection/BlockPosition';

export class RootBlock extends Block<RootBlockData, RootBlockChildNames> {
    private _editor: EditorState;
    readonly _position: BlockPosition;

    constructor(config: IBlockConfig<RootBlockType>, state?: Partial<BlockState>) {
        super(config, state);
        this._position = BlockPosition.root();
    }

    @computed
    get editor(): EditorState | null {
        return this._editor;
    }

    @computed
    get mode(): string {
        if (this.config.type === 'root:math') return 'math';
        return 'text';
    }

    @computed
    get position(): BlockPosition {
        return this._position;
    }

    @action
    setEditor(editor: EditorState) {
        this._editor = editor;
    }

    static create(state?: Partial<BlockState>): RootBlock {
        return new RootBlock(rootBlockConfig, state);
    }

    static createMathRoot(state?: Partial<BlockState>): RootBlock {
        return new RootBlock(mathRootBlockConfig, state);
    }
}
