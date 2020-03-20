import React from 'react';
import { IBlockConfig } from '../interfaces';
import { Block } from '../model';
import { PrinterOutput } from '../utils/PrinterOutput';

export interface TextBlockData {
    text: string;
}

export type AtomicBlock = Block<TextBlockData>;

export const atomicBlockConfig: IBlockConfig<AtomicBlock> = {
    type: 'atomic',

    render: ({ block, style }) => (
        <span style={style}>{block.data.text}</span>
    ),

    printers: {
        calchub: props => {
            return PrinterOutput.fromOne({
                source: props.block,
                text: props.block.data.text,
            });
        },
        python: props => {
            return PrinterOutput.fromOne({
                source: props.block,
                text: props.block.data.text,
            });
        }
    },
};
