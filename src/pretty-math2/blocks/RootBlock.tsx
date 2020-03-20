import React from 'react';
import { IBlockConfig } from '../interfaces';
import { Block } from '../model';

export interface RootBlockData {}
export type RootBlockChildNames = 'inner';
export type RootBlock = Block<RootBlockData, RootBlockChildNames>;

export const rootBlockConfig: IBlockConfig<RootBlock> = {
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
                order: 0,
            }
        },
        cursorOrder: {
            leftToRight: [],
            upToDown: [],
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
