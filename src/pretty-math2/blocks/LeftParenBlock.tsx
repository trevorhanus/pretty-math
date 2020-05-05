import React from 'react';
import { IBlockConfig } from '../interfaces';
import { Block } from '../model';
import { PrinterOutput } from '../utils/PrinterOutput';

export interface LeftParenBlockData {}
export type LeftParenBlock = Block<LeftParenBlockData>;

export const leftParenBlockConfig: IBlockConfig<LeftParenBlock> = {
    type: 'math:left_paren',

    render: ({ block, style }) => {
        return (
            <span style={style}>(</span>
        );
    },

    printers: {
        calchub: props => {
            return PrinterOutput.fromOne({
                source: props.block,
                text: '(',
            });
        },
        python: props => {
            return PrinterOutput.fromOne({
                source: props.block,
                text: '(',
            });
        }
    },
};
