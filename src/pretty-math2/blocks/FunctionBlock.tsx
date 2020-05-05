import { IBlockConfig } from 'pretty-math2/interfaces';
import { Block, BlockList } from 'pretty-math2/model';
import React from 'react';
import { PrinterOutput } from '../utils/PrinterOutput';

export interface FunctionBlockData {
    displayValue: string;
}

export interface FunctionBlockChildren {
    inner: BlockList;
}

export type FunctionBlockChildNames = 'inner';
export type FunctionBlock = Block<FunctionBlockData, FunctionBlockChildNames>;

export const functionBlockConfig: IBlockConfig<FunctionBlock> = {
    type: 'math:function',

    render: ({ block, children, style }) => (
        <span
            className="function"
            style={style}
        >
            {block.data.displayValue}({children.inner})
        </span>
    ),

    printers: {
        calchub: ({ block, children }) => {
            return PrinterOutput.fromMany([
                { text: block.data.displayValue, source: block },
                { text: '{(', source: block },
                children.inner,
                { text: ')}', source: block }
            ]);
        },
        python: ({ block, children }) => {
            return PrinterOutput.fromMany([
                { text: block.data.displayValue, source: block },
                { text: '(', source: block },
                children.inner,
                { text: ')', source: block }
            ]);
        }
    },

    composite: {
        children: {
            inner: {
                canBeNull: false,
                childNumber: 0
            }
        },
        cursorOrder: {
            right: {},
            left: {},
            up: {},
            down: {}
        },
        entry: {
            fromLeft: {
                up: [],
                right: ['inner'],
                down: []
            },
            fromRight: {
                up: [],
                left: ['inner'],
                down: []
            }
        }
    }
};
