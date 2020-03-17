import { IBlockConfig } from '../interfaces';
import { Block, BlockState } from './Block';
import { RootBlock as RootBlockType, rootBlockConfig, RootBlockData, RootBlockChildNames } from '../blocks/RootBlock';
import { EditorState } from './EditorState';

export class RootBlock extends Block<RootBlockData, RootBlockChildNames> {
    readonly _editor: EditorState;

    constructor(editor: EditorState, config: IBlockConfig<RootBlockType>, state?: Partial<BlockState>) {
        super(config, state);
        this._editor = editor;
    }

    get editor(): EditorState {
        return this._editor;
    }

    static create(editor: EditorState, state?: Partial<BlockState>): RootBlock {
        return new RootBlock(editor, rootBlockConfig, state);
    }
}
