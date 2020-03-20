import React, { CSSProperties } from 'react';
import { BlockListOpts } from './model';
import { EditorState } from './model/EditorState';
import { PrinterOutput } from './utils/PrinterOutput';

export enum Dir {
    Down,
    Right,
    Up,
    Left,
}

export interface IModel<S> {
    applyJS: (js: S) => void;
    toJS: () => S;
}

export interface PrinterProps<B> {
    block: B,
    children: Record<string, PrinterOutput>;
}

export type PrinterFn<B> = (props: PrinterProps<B>) => PrinterOutput;

export interface BlockRenderProps<B> {
    block: B;
    editor: EditorState;
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

export interface BlockEntry {
    fromLeft: {
        up?: ChildName;
        right?: ChildName;
        down?: ChildName;
    };
    fromRight: {
        up?: ChildName;
        left?: ChildName;
        down?: ChildName;
    }
}

export interface CursorOrder {
    leftToRight: ChildName[];
    rightToLeft?: ChildName[];
    upToDown: ChildName[];
    downToUp?: ChildName[];
}

export interface ICompositeBlockConfig {
    children: {
        [name: string]: BlockListOpts;
    };
    cursorOrder: CursorOrder;
    entry: BlockEntry;
}
