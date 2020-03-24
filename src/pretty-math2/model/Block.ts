import classNames from 'classnames';
import { action, computed, observable } from 'mobx';
import { BlockPosition } from 'pretty-math2/selection/BlockPosition';
import React from 'react';
import { BlockList, BlockListState } from '.';
import { generateId, omitNulls } from '../../common';
import {
    IBlockConfig,
    IBlockListConfig,
    ICompositeBlockConfig,
    ICursorOrderConfig,
    IEntryConfig,
    IModel,
    PrinterProps
} from '../interfaces';
import { mapObject } from '../utils/mapObject';
import { PrinterOutput } from '../utils/PrinterOutput';
import { someObject } from '../utils/someObject';
import { EditorState } from './EditorState';

export type BlockChildrenState<ChildNames extends string> = Record<ChildNames, BlockListState>;

export interface BlockState<D = any, C extends string = string> {
    id?: string;
    type: string;
    data?: D;
    children?: BlockChildrenState<C>;
}

export class Block<D = any, C extends string = string> implements IModel<BlockState<D, C>> {
    readonly children: Record<C, BlockList>;
    readonly config: IBlockConfig<Block<D, C>>;
    readonly id: string;
    @observable readonly ref: React.RefObject<HTMLElement>;
    @observable.ref data: D;
    @observable.ref list: BlockList | null;

    constructor(config: IBlockConfig<Block<D, C>>, data?: D, id?: string) {
        this.children = this.initChildrenMap(config.composite);
        this.config = config;
        this.data = data || ({} as D);
        this.id = id || generateId();
        this.ref = React.createRef<HTMLElement>();
        this.list = null; // set by BlockList when the block is added
    }

    @computed
    get childrenAreEmtpy(): boolean {
        return Object.values(this.children).every(child => (child as BlockList).length === 0);
    }

    get cursorOrder(): ICursorOrderConfig {
        return this.config.composite && this.config.composite.cursorOrder;
    }

    get editor(): EditorState {
        return this.list && this.list.editor;
    }

    get entry(): IEntryConfig {
        return this.config.composite && this.config.composite.entry;
    }

    get index(): number {
        return this.list ? this.list.getIndex(this) : 0;
    }

    get isComposite(): boolean {
        return Object.keys(this.children).length > 0;
    }

    get isSelected(): boolean {
        return this.editor.selection.isBlockSelected(this);
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

    contains(block: Block): boolean {
        return this === block || someObject(this.children, child => child.contains(block));
    }

    getBlockById(id: string): Block | null {
        if (this.id === id) {
            return this;
        }
        for (let listName in this.children) {
            const list = this.children[listName];
            const block = list.getBlockById(id);
            if (block) {
                return block;
            }
        }
        return null;
    }

    getChildByNumber(childNumber: number): BlockList {
        let list = null;
        for (let child in this.children) {

        }
        return
    }

    render(): React.ReactElement {
        const children = mapObject(this.children, (name: string, child: Block) => {
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
            className
        };

        return React.cloneElement(renderedBlock, props);
    }

    serialize(): BlockState<D, C> {
        return {
            id: this.id,
            type: this.type,
            data: this.data,
            children: mapObject(this.children, (childName: string, list: BlockList) => {
                return list.serialize();
            }),
        }
    }

    toCalchub(): PrinterOutput {
        const children = mapObject(this.children, (name: C, child: Block) => {
            return child.toCalchub();
        }) as Record<C, PrinterOutput>;

        const props: PrinterProps<any> = {
            block: this,
            children,
        };

        return this.config.printers.calchub(props);
    }

    toPython(): PrinterOutput {
        const children = mapObject(this.children, (name: C, child: Block) => {
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
        for (let childName in this.children) {
            const list = this.children[childName];
            const childState = childrenState[childName];
            list.applyState(childState);
        }
    }

    // Question: Is this ICompositeBlockConfig correct?
    private initChildrenMap(config?: ICompositeBlockConfig): Record<C, BlockList> {
        const childrenConfig = config ? config.children : {};
        return mapObject(childrenConfig, (childName: string, config: IBlockListConfig) => {
            return new BlockList(this, childName, config);
        });
    }
}
