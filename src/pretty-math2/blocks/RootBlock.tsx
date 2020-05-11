import React from 'react';
import {
    Block,
    IBlockConfig
} from 'pretty-math2/internal';

export interface RootBlockData {}
export type RootBlockChildNames = 'inner';
export type RootBlockType = Block<RootBlockData, RootBlockChildNames>;

export const rootBlockConfig: IBlockConfig<RootBlockType> = {
    type: 'root',

    render: ({ children }) => {
        return (
            <span>
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
