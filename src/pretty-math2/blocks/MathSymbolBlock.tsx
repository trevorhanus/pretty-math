import React from 'react';
import { IBlockConfig } from '../interfaces';
import { Block } from '../model';
import { PrinterOutput } from '../utils/PrinterOutput';

export interface MathSymbolBlockData {
    text: string;
    calchub: string;
    python: string;
}

export type MathSymbolBlock = Block<MathSymbolBlockData>;

export const mathSymbolBlockConfig: IBlockConfig<MathSymbolBlock> = {
    type: 'math:symbol',

    render: ({ block, style }) => (
        <span style={style}>{block.data.text}</span>
    ),

    printers: {
        calchub: props => {
            return PrinterOutput.fromOne({
                source: props.block,
                text: props.block.data.calchub,
            });
        },
        python: props => {
            return PrinterOutput.fromOne({
                source: props.block,
                text: props.block.data.python,
            });
        }
    },
};
