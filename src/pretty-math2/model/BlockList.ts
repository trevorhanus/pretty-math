import { action, computed, IObservableArray, observable, reaction } from 'mobx';
import { createBlock } from '../blocks/blocks';
import { IModel } from '../interfaces';
import { Block, BlockState } from '.';
import { PrinterOutput } from '../utils/PrinterOutput';
import React from 'react';
import { EditorState } from './EditorState';

export type BlockListState = BlockState[];

export interface BlockListOpts {
    canBeNull?: boolean;
    order: number;
}

const DEFAULT_OPTS = {
    canBeNull: true,
    order: 0,
};

export class BlockList implements IModel<BlockListState> {
    readonly name: string;
    readonly opts: BlockListOpts;
    readonly parent: Block;
    @observable readonly _blocks: IObservableArray<Block>;
    // keep an internal map of blockId => index so we can have O(1) lookup
    private _indexMap: { [blockId: string]: number };

    constructor(parent: Block, name: string, opts?: BlockListOpts) {
        this.name = name;
        this.parent = parent;
        this.opts = opts || DEFAULT_OPTS;
        this._blocks = observable.array([], { deep: false });
        this._blocks.forEach(b => b.list = this);
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
        return this.parent.editor;
    }

    @computed
    get length(): number {
        return this.blocks.length;
    }

    @computed
    get start(): Block {
        return this.getBlock(0);
    }

    @computed
    get end(): Block {
        return this.getBlock(this.length - 1);
    }

    contains(block: Block): boolean {
        return this.blocks.indexOf(block) > -1 || this.blocks.some(b => b.contains(block));
    }

    getBlock(i: number): Block {
        return (i != null && i > -1 && this.blocks.length > 0 && i < this.blocks.length)
            ? this.blocks[i]
            : null;
    }

    getIndex(block: Block): number {
        return this._indexMap[block.id];
    }

    next(block: Block): Block {
        const i = this.getIndex(block);
        return this.getBlock(i + 1);
    }

    prev(block: Block): Block {
        const i = this.getIndex(block);
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

    toCalchub(): PrinterOutput {
        return PrinterOutput.fromMany(this.blocks.map(b => b.toCalchub()));
    }

    toJS(): BlockListState {
        return this.blocks.map(block => block.toJS());
    }

    @action
    splice(start: number, deleteCount: number, ...blocks: Block[]) {
        blocks.forEach(b => b.list = this);
        this._blocks.splice(start, deleteCount, ...blocks);
    }

    @action
    applyJS(state: BlockListState) {
        this._blocks.replace(state.map(s => {
            return createBlock(s.type, s);
        }));
    }

    private reindex() {
        if (!this.opts.canBeNull && this.blocks.length === 0) {
            this._blocks.push(createBlock('blank'));
        }
        const map = {};
        this.blocks.forEach((block, i) => {
            block.list = this;
            map[block.id] = i;
        });
        this._indexMap = map;
    }
}
