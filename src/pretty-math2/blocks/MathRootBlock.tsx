import * as React from 'react';
import { Block } from '../model';
import { IBlockConfig } from 'pretty-math2/interfaces';

export interface MathRootBlockData {}
export type MathRootBlockChildNames = 'content';
export type MathRootBlock = Block<MathRootBlockData>;

export const mathRootBlockConfig: IBlockConfig<MathRootBlock> = {
    type: 'root:math',

    render: ({ children }) => {
        return (
            <span className='math-root'>
                {children.content}
            </span>
        )
    },

    printers: {
        calchub: ({ children }) => {
            return children.content;
        },
        python: ({ children }) => {
            return children.content;
        }
    },

    composite: {
        children: {
            content: {
                canBeNull: false,
                order: 0,
            }
        }
    },

};
