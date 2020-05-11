import React from 'react';
import {
    Block,
    IBlockConfig,
    PrinterOutput
} from 'pretty-math2/internal';

export interface RightParenBlockData {
    text?: string;
}
export type RightParenBlock = Block<RightParenBlockData>;

export const rightParenBlockConfig: IBlockConfig<RightParenBlock> = {
    type: 'math:rightParen',

    render: ({ block, style }) => {
        const text = block.data.text ? block.data.text : ')';
        return (
            <span style={style}>{text}</span>
        );
    },

    printers: {
        calchub: ({ block }) => {
            const text = block.data.text ? block.data.text : ')';
            return PrinterOutput.fromOne({
                source: block,
                text: text,
            });
        },
        python: ({ block }) => {
            const text = block.data.text ? block.data.text : ')';
            return PrinterOutput.fromOne({
                source: block,
                text: text,
            });
        }
    },
};