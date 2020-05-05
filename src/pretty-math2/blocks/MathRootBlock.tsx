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
