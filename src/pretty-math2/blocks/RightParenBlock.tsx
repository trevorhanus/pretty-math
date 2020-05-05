import React from 'react';
import { IBlockConfig } from '../interfaces';
import { Block } from '../model';
import { PrinterOutput } from '../utils/PrinterOutput';

export interface RightParenBlockData {}
export type RightParenBlock = Block<RightParenBlockData>;

export const rightParenBlockConfig: IBlockConfig<RightParenBlock> = {
    type: 'math:right_paren',

    render: ({ block, style }) => {
        return (
            <span style={style}>)</span>
        );
    },

    printers: {
        calchub: props => {
            return PrinterOutput.fromOne({
                source: props.block,
                text: ')',
            });
        },
        python: props => {
            return PrinterOutput.fromOne({
                source: props.block,
                text: ')',
            });
        }
    },
};