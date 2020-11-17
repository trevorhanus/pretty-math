import classNames from 'classnames';
import { generateId, omitEmpty } from 'common';
import { INode } from 'math';
import { action, computed, observable } from 'mobx';
import { BlockList, BlockListState, BlockPosition, getTargetedSide, IBlockConfig, IBlockListConfig, ICompositeBlockConfig, ICursorOrderConfig, IEntryConfig, mapObject, PrinterOutput, PrinterProps, someObject } from 'pretty-math/internal';
import type { Editor, IModel } from 'pretty-math/internal';
import React from 'react';

declare global {
    interface MouseEvent {
        blockData?: {
            block: Block;
        };
    }
}

export type BlockChildrenState<ChildNames extends string> = Record<ChildNames, BlockListState>;

export interface BlockState<D = any, C extends string = string> {
    id?: string;
    type: string;
    data?: D;
    children?: BlockChildrenState<C>;
}

export class Block<D = any, C extends string = string> implements IModel<BlockState<D, C>> {
    readonly childMap: Record<C, BlockList>;
    readonly config: IBlockConfig<Block<D, C>>;
    readonly id: string;
    @observable readonly ref: React.RefObject<HTMLElement>;
    @observable.ref data: D;
    @observable.ref list: BlockList | null;
    @observable.ref mathNode: INode;

    constructor(config: IBlockConfig<Block<D, C>>, data?: D, id?: string) {
        this.childMap = this.initChildrenMap(config.composite);
        this.config = config;
        this.data = data || ({} as D);
        this.id = id || generateId();
        this.ref = React.createRef<HTMLElement>();
        this.list = null; // set by BlockList when the block is added
    }

    @computed
    get allChildrenAreNull(): boolean {
        return this.children.every(c => c.isNull);
    }

    get children(): BlockList[] {
        return Object.values(this.childMap);
    }

    @computed
    get childrenAreEmpty(): boolean {
        return this.children.every(c => c.isEmpty);
    }

    get cursorOrder(): ICursorOrderConfig {
        return this.config.composite && this.config.composite.cursorOrder;
    }

    get editor(): Editor {
        return this.list && this.list.editor;
    }

    get entry(): IEntryConfig {
        return this.config.composite && this.config.composite.entry;
    }

    get index(): number {
        return this.list ? this.list.getIndex(this) : 0;
    }

    get isComposite(): boolean {
        return this.children.length > 0;
    }

    get isSelected(): boolean {
        return this.editor && this.editor.selection.isBlockSelected(this);
    }

    @computed
    get mode(): string {
        return this.list && this.list.mode;
    }

    @computed
    get next(): Block | null {
        return this.list && this.list.next(this);
    }

    @computed
    get parent(): Block | null {
        return this.list && this.list.parent;
    }

    @computed
    get position(): BlockPosition {
        return this.list ? this.list.createChildPosition(this) : BlockPosition.root();
    }

    @computed
    get prev(): Block | null {
        return this.list && this.list.prev(this);
    }

    get type(): string {
        return this.config.type;
    }

    clone(): Block {
        return new Block(this.config, { ...this.data });
    }

    contains(block: Block): boolean {
        return this === block || someObject(this.childMap, child => child.contains(block));
    }

    deepClone(): Block {
        const b = this.clone();
        if (this.childMap) {
            Object.keys(this.childMap).forEach(key => {
                this.childMap[key].blocks.forEach(block => {
                    b.childMap[key].insertBlock(b.childMap[key].end, block.deepClone());
                });
            });
        }
        return b;
    }

    getBlockById(id: string): Block | null {
        if (this.id === id) {
            return this;
        }
        for (let listName in this.childMap) {
            const list = this.childMap[listName];
            const block = list.getBlockById(id);
            if (block) {
                return block;
            }
        }
        return null;
    }

    handleMouseDown = (e: React.MouseEvent) => {
        if (e.nativeEvent.blockData) {
            // some child already handled it
            return;
        }

        addBlockData(e, this);
    };

    handleMouseMove = (e: React.MouseEvent) => {
        if (e.buttons !== 1) {
            return;
        }

        if (e.nativeEvent.blockData) {
            // some child already handled it
            return;
        }

        addBlockData(e, this);
    };

    render(): React.ReactElement {
        const children = mapObject(this.childMap, (name: string, child: Block) => {
            return child.render();
        });

        const renderedBlock = this.config.render({
            block: this,
            children,
            editor: this.editor,
            style: {}, // TODO: get the style from the editor.inlineStyles
        });

        const className = classNames(
            renderedBlock.props.className,
            { 'selected-block': this.isSelected },
        );

        const props = {
            ...renderedBlock.props,
            key: this.id,
            ref: this.ref,
            onMouseDown: this.handleMouseDown,
            onMouseMove: this.handleMouseMove,
            className
        };

        return React.cloneElement(renderedBlock, props);
    }

    serialize(opts?: { omitId: boolean }): BlockState<D, C> {
        opts = opts || { omitId: false };
        return omitEmpty({
            id: opts.omitId ? null : this.id,
            type: this.type,
            data: this.data,
            children: mapObject(this.childMap, (childName: string, list: BlockList) => {
                return list.serialize(opts);
            }),
        });
    }

    toCalchub(): PrinterOutput {
        const children = mapObject(this.childMap, (name: C, child: BlockList) => {
            return child.toCalchub();
        }) as Record<C, PrinterOutput>;

        const props: PrinterProps<any> = {
            block: this,
            children,
        };

        return this.config.printers.calchub(props);
    }

    toPython(): PrinterOutput {
        const children = mapObject(this.childMap, (name: C, child: BlockList) => {
            return child.toPython();
        }) as Record<C, PrinterOutput>;

        const props: PrinterProps<any> = {
            block: this,
            children,
        };

        return this.config.printers.python(props);
    }

    @action
    applyState(state: BlockState<D>) {
        state = state || {} as BlockState<D>;
        this.data = state.data || {} as D;
        const childrenState = state.children || {};
        for (let childName in this.childMap) {
            const list = this.childMap[childName];
            const childState = childrenState[childName];
            list.applyState(childState);
        }
    }

    @action
    setData(data: Partial<D>) {
        this.data = {
            ...this.data,
            ...data,
        }
    }

    private initChildrenMap(config?: ICompositeBlockConfig): Record<C, BlockList> {
        const childrenConfig = config ? config.children : {};
        return mapObject(childrenConfig, (childName: string, config: IBlockListConfig) => {
            return new BlockList(this, childName, config);
        });
    }
}

function addBlockData(e: React.MouseEvent, block: Block) {
    const side = getTargetedSide(e, e.nativeEvent.target as HTMLSpanElement);

    if (side === 0) {
        e.nativeEvent.blockData = { block };
    }

    if (side === 1) {
        if (block.next) {
            e.nativeEvent.blockData = { block: block.next };
        } else {
            e.nativeEvent.blockData = { block };
        }
    }
}
