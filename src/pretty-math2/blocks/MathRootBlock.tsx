import * as React from 'react';
import { Block } from '../model';
import { IBlockConfig } from 'pretty-math2/interfaces';

export interface MathRootBlockData {}
export type MathRootBlockChildNames = 'inner';
export type MathRootBlock = Block<MathRootBlockData>;

export const mathRootBlockConfig: IBlockConfig<MathRootBlock> = {
    type: 'root:math',

    render: ({ children }) => {
        return (
            <span className='math-root'>
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
            upToDown: []
        },
        entry: {
            fromLeft: {
                up: 'inner',
                right: 'inner',
                down: 'inner'
            },
            fromRight: {
                up: 'inner',
                left: 'inner',
                down: 'inner'
            }
        }
    },

};
