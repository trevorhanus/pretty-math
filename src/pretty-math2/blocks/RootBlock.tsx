import React from 'react';
import { IBlockConfig } from '../interfaces';
import { Block } from '../model';

export interface RootBlockData {}
export type RootBlockChildNames = 'content';
export type RootBlock = Block<RootBlockData, RootBlockChildNames>;

export const rootBlockConfig: IBlockConfig<RootBlock> = {
    type: 'root',

    render: ({ children }) => {
        return (
            <span>
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
        },
        cursorOrder: {
            leftToRight: [],
            upToDown: [],
        },
        entry: {
            fromLeft: {
                up: 'content',
                right: 'content',
                down: 'content',
            },
            fromRight: {
                up: 'content',
                left: 'content',
                down: 'content',
            }
        }
    },

};
