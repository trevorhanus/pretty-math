import React, { CSSProperties } from 'react';
import { Block } from './model/Block';
import { Editor } from './model/Editor';
import { PrinterOutput } from './utils/PrinterOutput';

export type HandlerResponse = 'handled' | 'not_handled' | null;

export enum Dir {
    Down,
    Right,
    Up,
    Left,
}

export interface IModel<S> {
    applyState: (state: S) => void;
    serialize: () => S;
}

export interface PrinterProps<B> {
    block: B,
    children: Record<string, PrinterOutput>;
}

export type PrinterFn<B> = (props: PrinterProps<B>) => PrinterOutput;

export interface BlockRenderProps<B> {
    block: B;
    editor: Editor;
    style: CSSProperties;
    children?: Record<string, React.ReactElement>;
}

export type BlockRenderFn<B> = (props: BlockRenderProps<B>) => React.ReactElement;

export type ChildName = string;

export interface IBlockConfig<B> {
    type: string;
    printers: {
        calchub: PrinterFn<B>;
        python: PrinterFn<B>;
    };
    render: BlockRenderFn<B>;
    composite?: ICompositeBlockConfig;
}

export interface IEntryConfig {
    fromLeft: {
        up?: ChildName[];
        right?: ChildName[];
        down?: ChildName[];
    };
    fromRight: {
        up?: ChildName[];
        left?: ChildName[];
        down?: ChildName[];
    }
}

export interface ICursorOrderConfig {
    right: {
        [name: string]: ChildName;
    },
    left: {
        [name: string]: ChildName;
    },
    up: {
        [name: string]: ChildName;
    },
    down: {
        [name: string]: ChildName;
    }
}

export interface IBlockListConfig {
    canBeNull: boolean;
    childNumber: number;
    transparentEndBlock?: boolean;
}

export interface ICompositeBlockConfig {
    children: {
        [name: string]: IBlockListConfig;
    };
    cursorOrder: ICursorOrderConfig;
    entry: IEntryConfig;
    handleRemoveOutOf?: (block: Block, childList: string, editor: Editor) => HandlerResponse;
}
