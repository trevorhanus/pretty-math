import React from 'react';
import { IBlockConfig } from '../interfaces';
import { Block } from '../model';
import { PrinterOutput } from '../utils/PrinterOutput';

export type BlockLevelBlockChildNames = 'content';

export interface BlockLevelBlockData {
    as: string;
}

export type BlockLevelBlock = Block<BlockLevelBlockData, BlockLevelBlockChildNames>;

export const blockLevelBlockConfig: IBlockConfig<BlockLevelBlock> = {
    type: 'text:block_level',

    printers: {
        calchub: props => {
            const { block } = props;
            const content = block.children.content.toCalchub();
            return PrinterOutput.fromMany([
                content,
                {
                    source: block,
                    text: '\n',
                }
            ]);
        },
        python: () => {
            return PrinterOutput.blank();
        }
    },

    render: ({ block, style, children }) => {
        const elType = block.data.as || 'div';

        return React.createElement(
            elType,
            { style },
            children,
        );
    },

    composite: {
        children: {
            content: {
                order: 0,
                canBeNull: false,
            },
        },
        entry: {
            fromLeft: {
                up: 'content',
                right: 'content',
                down: 'content',
            },
            fromRight: {
                up: 'content',
                left: 'content',
                down: 'content',
            }
        }
    }
};
