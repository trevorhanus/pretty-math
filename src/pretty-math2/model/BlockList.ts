import { action, computed, IObservableArray, observable, reaction } from 'mobx';
import { BlockPosition } from 'pretty-math2/selection/BlockPosition';
import React from 'react';
import { Block, BlockState } from '.';
import { createBlock } from '../blocks/blocks';
import { EndBlock } from '../blocks/EndBlock';
import { IBlockListConfig, IModel } from '../interfaces';
import { invariant } from '../utils/invariant';
import { PrinterOutput } from '../utils/PrinterOutput';
import { EditorState } from './EditorState';

export type BlockListState = BlockState[];

const DEFAULT_CONFIG = {
    canBeNull: true,
    order: 0,
};

export class BlockList implements IModel<BlockListState> {
    readonly name: string;
    readonly config: IBlockListConfig;
    readonly parent: Block;
    @observable readonly _blocks: IObservableArray<Block>;
    // keep an internal map of blockId => index so we can have O(1) lookup
    private _indexMap: { [blockId: string]: number };

    constructor(parent: Block, name: string, config?: IBlockListConfig) {
        this.name = name;
        this.parent = parent;
        this.config = config || DEFAULT_CONFIG;
        this._blocks = observable.array([], { deep: false });
        if (!this.config.canBeNull) {
            this._blocks.push(createBlock('end'));
        }
        reaction(
            () => this._blocks.slice(),
            () => this.reindex(),
            { fireImmediately: true },
        );
    }

    @computed
    get blocks(): Block[] {
        return this._blocks;
    }

    get editor(): EditorState {
        invariant(!this.parent, `BlockList does not have a parent.`);
        return this.parent.editor;
    }

    get position(): BlockPosition {
        invariant(!this.parent, `BlockList does not have a parent.`);
        return this.parent.position.incLevel(this.config.order);
    }

    @computed
    get length(): number {
        return this.blocks.length;
    }

    @computed
    get mode(): string {
        invariant(!this.parent, `BlockList does not have a parent.`);
        return this.parent.mode;
    }

    @computed
    get start(): Block | null {
        return this.getBlock(0);
    }

    @computed
    get end(): Block | null {
        return this.getBlock(this.length - 1);
    }

    contains(block: Block): boolean {
        return this.blocks.indexOf(block) > -1 || this.blocks.some(b => b.contains(block));
    }

    createChildPosition(child: Block): BlockPosition {
        const index = this.getIndex(child);
        invariant(index == null, `BlockList.createChildPosition was invoked with a block that is not a child of the list.`);
        return new BlockPosition(this.position.path, index);
    }

    getBlock(i: number): Block {
        return (i != null && i > -1 && this.blocks.length > 0 && i < this.blocks.length)
            ? this.blocks[i]
            : null;
    }

    getIndex(block: Block): number {
        if (!block) return null;
        return this._indexMap[block.id];
    }

    @action
    insertBlock(focus: Block, insertBlock: Block) {
        invariant(!this.contains(focus), `BlockList.insertBlock invoked with a block not in the list.`);
        this.splice(this.getIndex(focus), 0, insertBlock);
    }

    next(fromBlock: Block): Block {
        const i = this.getIndex(fromBlock);
        invariant(i == null, `BlockList.next invoked with a block not in the list.`);
        return this.getBlock(i + 1);
    }

    prev(fromBlock: Block): Block {
        const i = this.getIndex(fromBlock);
        invariant(i == null, `BlockList.next invoked with a block not in the list.`);
        return this.getBlock(i - 1);
    }

    render(): React.ReactNode {
        const renderedBlocks = this.blocks.map(b => b.render());

        return React.createElement(
            React.Fragment,
            {},
            renderedBlocks,
        );
    }

    @action
    removeBlock(block: Block): Block {
        const index = this.getIndex(block);
        if (index == null) {
            return;
        }
        let cursorAnchor = block.prev;
        const endBlock = this.splice(index, 1);
        if (endBlock) {
            cursorAnchor = endBlock;
        }
        return cursorAnchor;
    }

    toCalchub(): PrinterOutput {
        return PrinterOutput.fromMany(this.blocks.map(b => b.toCalchub()));
    }

    toJS(): BlockListState {
        return this.blocks.map(block => block.toJS());
    }

    @action
    applyJS(state: BlockListState) {
        this._blocks.replace(state.map(s => {
            return createBlock(s.type, s);
        }));
    }

    /**
     * splice() is a low level method that should
     * be called whenever we are adding or removing
     * a block from the list
     */
    @action
    splice(start: number, deleteCount: number, ...blocks: Block[]): EndBlock | null {
        this._blocks.splice(start, deleteCount, ...blocks);
        if (!this.config.canBeNull && this._blocks.length === 0) {
            const endBlock = createBlock('end');
            this._blocks.push(endBlock);
            return endBlock;
        }
    }

    private reindex() {
        const map = {};
        this.blocks.forEach((block, i) => {
            block.list = this;
            map[block.id] = i;
        });
        this._indexMap = map;
    }
}
