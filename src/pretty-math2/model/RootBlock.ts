import { IBlockConfig } from '../interfaces';
import { Block, BlockState } from './Block';
import { RootBlock as RootBlockType, RootBlockData, RootBlockChildNames } from '../blocks/RootBlock';
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
        return this.config.type === 'root:math' ? 'math' : 'text';
    }

    @computed
    get position(): BlockPosition {
        return this._position;
    }

    @action
    applyState(state: BlockState) {
        if (this.type !== state.type) {
            throw new Error(`Invalid state for RootBlock. Expected type '${this.type}' but got type '${state.type}'.`);
        }
        super.applyState(state);
    }

    @action
    setEditor(editor: EditorState) {
        this._editor = editor;
    }
}
