import * as React from 'react';
import {
    Block,
    IBlockConfig
} from 'pretty-math2/internal';

export interface MathRootBlockData {}
export type MathRootBlockChildNames = 'inner';
export type MathRootBlockType = Block<MathRootBlockData>;

export const mathRootBlockConfig: IBlockConfig<MathRootBlockType> = {
    type: 'root:math',

    render: ({ children }) => {
        return (
            <span className='pm-math'>
                {children.inner}
            </span>
        )
    },

    printers: {
        calchub: ({ children }) => {
            return children.inner;
        },
        python: ({ children }) => {
            return children.inner;
        }
    },

    composite: {
        children: {
            inner: {
                canBeNull: false,
                childNumber: 0,
                transparentEndBlock: true,
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
    },

};
