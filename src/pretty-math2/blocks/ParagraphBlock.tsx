import React from 'react';
import { IBlockConfig } from '../interfaces';
import { Block } from '../model';
import { PrinterOutput } from '../utils/PrinterOutput';

export type ParagraphBlockChildNames = 'content';

export interface ParagraphBlockData {
    as: string;
}

export type ParagraphBlock = Block<ParagraphBlockData, ParagraphBlockChildNames>;

export const paragraphBlockConfig: IBlockConfig<ParagraphBlock> = {
    type: 'text:paragraph',

    printers: {
        calchub: props => {
            const { block, children } = props;
            return PrinterOutput.fromMany([
                children.content,
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
            children.content,
        );
    },

    composite: {
        children: {
            content: {
                order: 0,
                canBeNull: false,
            },
        },
        cursorOrder: {
            leftToRight: [],
            upToDown: [],
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
