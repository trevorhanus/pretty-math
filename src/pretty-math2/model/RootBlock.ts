import { action, computed, reaction } from 'mobx';
import { parseCalchub } from 'math';
import {
    Block,
    BlockPosition,
    BlockState,
    Editor,
    getStartIndexForSource,
    IBlockConfig,
    RootBlockChildNames,
    RootBlockData,
    RootBlockType,
    walkTree
} from 'pretty-math2/internal';

export class RootBlock extends Block<RootBlockData, RootBlockChildNames> {
    private _editor: Editor;
    readonly _position: BlockPosition;

    constructor(config: IBlockConfig<RootBlockType>, data?: RootBlockData, id?: string) {
        super(config, data, id);
        this._position = BlockPosition.root();
    }

    @computed
    get editor(): Editor | null {
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
    setEditor(editor: Editor) {
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
        try {
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
        } catch (e) {
            
        }
    }
}
