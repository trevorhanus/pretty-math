import { action, computed, IObservableArray, observable, reaction } from 'mobx';
import { EndBlock } from 'pretty-math2/blocks/EndBlock';
import { BlockPosition } from 'pretty-math2/selection/BlockPosition';
import React from 'react';
import { Block, BlockState } from '.';
import { BlockFactory } from '../blocks/BlockFactory';
import { IBlockListConfig, IModel } from '../interfaces';
import { invariant } from '../utils/invariant';
import { PrinterOutput } from '../utils/PrinterOutput';
import { Editor } from './Editor';

export type BlockListState = BlockState[];

const DEFAULT_CONFIG = {
    canBeNull: true,
    order: 0,
    transparentEndBlock: false,
};

export class BlockList implements IModel<BlockListState> {
    readonly name: string;
    readonly config: IBlockListConfig;
    readonly parent: Block;
    @observable readonly _blocks: IObservableArray<Block>;
    // keep an internal map of blockId => index so we can have O(1) lookup
    @observable private _indexMap: { [blockId: string]: number };

    constructor(parent: Block, name: string, config?: IBlockListConfig) {
        this.name = name;
        this.parent = parent;
        this.config = {
            ...DEFAULT_CONFIG,
            ...config,
        };
        this._blocks = observable.array([], { deep: false });
        if (!this.config.canBeNull) {
            this.addEndBlock();
        }
    }

    @computed
    get blocks(): Block[] {
        return this._blocks;
    }

    get editor(): Editor {
        invariant(!this.parent, `BlockList does not have a parent.`);
        return this.parent.editor;
    }

    @computed
    get isNull(): boolean {
        return this.blocks.length === 0;
    }

    @computed
    get isEmpty(): boolean {
        return this.blocks.length === 1 && this.blocks[0].type === 'end';
    }

    get position(): BlockPosition {
        invariant(!this.parent, `BlockList does not have a parent.`);
        return this.parent.position.incLevel(this.config.childNumber);
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
        return this.position.forIndex(index);
    }

    getBlock(i: number): Block {
        return (i != null && i > -1 && this.blocks.length > 0 && i < this.blocks.length)
            ? this.blocks[i]
            : null;
    }

    getBlockById(id: string): Block | null {
        return this.blocks.find(b => {
            return b.getBlockById(id);
        });
    }

    getIndex(block: Block): number {
        if (!block) return null;
        return this._indexMap[block.id];
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

    serialize(opts?: { omitId: boolean }): BlockListState {
        return this.blocks.map(b => b.serialize(opts));
    }

    toCalchub(): PrinterOutput {
        return PrinterOutput.fromMany(this.blocks.map(b => b.toCalchub()));
    }

    toPython(): PrinterOutput {
        return PrinterOutput.fromMany(this.blocks.map(b => b.toPython()));
    }

    @action
    addBlocks(...blocks: Block[]) {
        if (!blocks || blocks.length === 0) {
            return;
        }
        if (this.isNull) {
            this.addEndBlock();
        }
        blocks.forEach(b => {
            this.insertBlock(this.end, b);
        });
    }

    @action
    addEndBlock(): EndBlock {
        if (this.isNull || this.end.type !== 'end') {
            const endBlock = BlockFactory.createBlock('end');
            this.splice(-1, 0, endBlock);
        }
        return this.end;
    }

    @action
    applyState(state: BlockListState) {
        if (!state) {
            return;
        }
        this._blocks.replace(state.map(s => {
            return BlockFactory.createBlockFromState(s);
        }));
        this.reindex();
    }

    @action
    insertBlock(focus: Block, insertBlock: Block) {
        // End blocks can only be inserted using the addEndBlock() function
        if (insertBlock.type === 'end') {
            return;
        }
        invariant(!this.contains(focus), `BlockList.insertBlock invoked with a block not in the list.`);
        this.splice(this.getIndex(focus), 0, insertBlock);
    }

    @action
    removeBlock(block: Block) {
        const index = this.getIndex(block);
        invariant(index == null, `BlockList.removeNext tried to remove a block that was not in the list.`);
        this.splice(index, 1);
    }

    /**
     * splice() is a low level method that should
     * be called whenever we are adding or removing
     * a block from the list
     */
    @action
    splice(start: number, deleteCount: number, ...blocks: Block[]) {
        this._blocks.splice(start, deleteCount, ...blocks);
        invariant(!this.config.canBeNull && this._blocks.length === 0, 'BlockList can not be null but was empty');
        this.reindex();
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
