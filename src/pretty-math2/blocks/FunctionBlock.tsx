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
        <span style={style}>{block.data.displayValue}({children.child})</span>
    ),

    printers: {
        calchub: ({ block, children }) => {
            return PrinterOutput.fromMany(
                { text: block.data.displayValue, source: block },
                { text: '{(', source: block },
                children,
                { text: ')}', source: block }
            );
        },
        python: ({ block, children }) => {
            return PrinterOutput.fromMany(
                { text: block.data.displayValue, source: block },
                { text: '(', source: block },
                children,
                { text: ')', source: block }
            );
        }
    },

    composite: {
        children: {
            child: {
                canBeNull: false,
                order: 0
            }
        },
        cursorOrder: {
            leftToRight: [],
            upToDown: []
        },
        entry: {
            fromLeft: {
                right: 'child'
            },
            fromRight: {
                left: 'child'
            }
        }
    }
};
