import React from 'react';
import {
    Block,
    IBlockConfig,
    PrinterOutput
} from 'pretty-math/internal';

export interface LeftParenBlockData {
    text?: string;
}
export type LeftParenBlock = Block<LeftParenBlockData>;

export const leftParenBlockConfig: IBlockConfig<LeftParenBlock> = {
    type: 'math:leftParen',

    render: ({ block, style }) => {
        const text = block.data.text ? block.data.text : '(';
        return (
            <span style={style}>{text}</span>
        );
    },

    printers: {
        calchub: ({ block }) => {
            const text = block.data.text ? block.data.text : '(';
            return PrinterOutput.fromOne({
                source: block,
                text: text,
            });
        },
        python: ({ block }) => {
            const text = block.data.text ? block.data.text : '(';
            return PrinterOutput.fromOne({
                source: block,
                text: text,
            });
        }
    },
};
