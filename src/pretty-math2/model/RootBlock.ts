import { parseCalchub } from '../../math';
import { IBlockConfig } from '../interfaces';
import { walkTree } from '../utils/BlockUtils';
import { getStartIndexForSource } from '../utils/PrinterOutput';
import { Block, BlockState } from './Block';
import { RootBlock as RootBlockType, RootBlockData, RootBlockChildNames } from '../blocks/RootBlock';
import { EditorState } from './EditorState';
import { action, computed, reaction } from 'mobx';
import { BlockPosition } from 'pretty-math2/selection/BlockPosition';

export class RootBlock extends Block<RootBlockData, RootBlockChildNames> {
    private _editor: EditorState;
    readonly _position: BlockPosition;

    constructor(config: IBlockConfig<RootBlockType>, data?: RootBlockData, id?: string) {
        super(config, data, id);
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

export class MathRootBlock extends RootBlock {

    constructor(config: IBlockConfig<RootBlockType>, data?: RootBlockData, id?: string) {
        super(config, data, id);
        reaction(
            () => this.serialize(),
            () => this.handleContentChange(),
            { fireImmediately: true },
        );
    }

    @action
    handleContentChange() {
        const { text, sourceMap } = this.toCalchub();
        const parseResult = parseCalchub(text);

        if (parseResult.error) {
            return;
        }

        // now for every block, set the corresponding mathNode
        walkTree(this, block => {
            const startIndex = getStartIndexForSource(block, sourceMap);

            if (startIndex == null) {
                return;
            }

            block.mathNode = parseResult.sourceMap[startIndex];
        });
    }
}
