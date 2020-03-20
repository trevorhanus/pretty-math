import React from 'react';
import { Block } from 'pretty-math2/model';
import { IBlockConfig } from 'pretty-math2/interfaces';

export interface FunctionBlockData {
    displayValue: string
}

export type FunctionBlockChildNames = 'child';

export type FunctionBlock = Block<FunctionBlockData, FunctionBlockChildNames>;

export const functionBlockConfig: IBlockConfig<FunctionBlock> = {
    type: 'function:block',
    render: ({ block, children, style }) => (
        <span style={style}>{block.data.displayValue}({children.child})</span>
    ),
    printers: {
        calchub: ({ children }) => {
            return children.child;
        },
        python: ({ children }) => {
            return children.child;
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
}