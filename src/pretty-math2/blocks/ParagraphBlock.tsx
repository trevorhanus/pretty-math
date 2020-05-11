import React from 'react';
import {
    Block,
    IBlockConfig,
    PrinterOutput
} from 'pretty-math2/internal';

export type ParagraphBlockChildNames = 'inner';

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
                children.inner,
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
            children.inner,
        );
    },

    composite: {
        children: {
            inner: {
                canBeNull: false,
                childNumber: 0,
                transparentEndBlock: true,
            },
        },
        cursorOrder: {
            right: {},
            left: {},
            up: {},
            down: {}
        },
        entry: {
            fromLeft: {
                up: ['inner'],
                right: ['inner'],
                down: ['inner']
            },
            fromRight: {
                up: ['inner'],
                left: ['inner'],
                down: ['inner']
            }
        }
    }
};
