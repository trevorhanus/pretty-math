import { action, computed, observable } from 'mobx';
import React from 'react';
import { BlockList, BlockListOpts, BlockListState } from '.';
import { generateId, omitNulls } from '../../common';
import { IBlockConfig, ICompositeBlockConfig, IModel, PrinterProps } from '../interfaces';
import { mapObject } from '../utils/mapObject';
import { PrinterOutput } from '../utils/PrinterOutput';
import { someObject } from '../utils/someObject';
import { EditorState } from './EditorState';

export type BlockChildrenState<ChildNames extends string> = Record<ChildNames, BlockListState>;

export interface BlockState<D = any, C extends string = string> {
    id: string;
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
    @observable.ref list: BlockList;

    constructor(config: IBlockConfig<Block<D, C>>, state?: Partial<BlockState>) {
        state = state || {};
        this.children = this.initChildrenMap(config.composite);
        this.config = config;
        this.data = state.data || {};
        this.id = state.id || generateId();
        this.ref = React.createRef<HTMLElement>();
        this.list = null; // set by BlockList when the block is added
    }

    get editor(): EditorState {
        return this.list.editor;
    }

    @computed
    get mode(): string {
        return this.list && this.list.mode;
    }

    @computed
    get next(): Block {
        return this.list && this.list.next(this);
    }

    @computed
    get prev(): Block {
        return this.list && this.list.prev(this);
    }

    get type(): string {
        return this.config.type;
    }

    contains(block: Block): boolean {
        return this === block || someObject(this.children, child => child.contains(block));
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

        const props = {
            ...renderedBlock.props,
            key: this.id,
            ref: this.ref,
        };

        return React.cloneElement(renderedBlock, props);
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

    toJS(): BlockState<D> {
        return omitNulls({
            id: this.id,
            type: this.type,
            data: this.data,
            children: mapObject(this.children, (childName: string, child: BlockList) => {
                return child.toJS();
            }),
        });
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
    applyJS(state: BlockState<D>) {
        state = state || {} as BlockState<D>;
        this.data = state.data || {} as D;
    }

    // Question: Is this ICompositeBlockConfig correct?
    private initChildrenMap(config?: ICompositeBlockConfig): Record<C, BlockList> {
        config = config || { children: {} };
        const childrenConfig = config.children;
        return mapObject(childrenConfig, (childName: string, opts: BlockListOpts) => {
            return new BlockList(this, childName, opts);
        });
    }
}
