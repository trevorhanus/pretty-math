import { IBlockConfig } from 'pretty-math2/interfaces';
import { Block } from 'pretty-math2/model';
import { PrinterOutput } from 'pretty-math2/utils/PrinterOutput';
import React from 'react';

export interface FractionBlockData {}
export type FractionBlockChildNames = 'num' | 'denom';
export type FractionBlock = Block<FractionBlockData, FractionBlockChildNames>;

export const fractionBlockConfig: IBlockConfig<FractionBlock> = {
    type: 'math:fraction',

    render: ({ block, children, style }) => (
        <span className="fraction">
            <span className='numerator'>{children.num}</span>
            <span className="fraction-line">
                <span className="line" />
            </span>
            <span className='denominator'>{children.denom}</span>
        </span>
    ),

    printers: {
        calchub: ({ children }) => {
            return PrinterOutput.blank();
        },
        python: ({ children }) => {
            return PrinterOutput.blank();
        }
    },

    composite: {
        children: {
            num: {
                canBeNull: false,
                order: 0
            },
            denom: {
                canBeNull: false,
                order: 1
            }
        },
        cursorOrder: {
            leftToRight: [],
            upToDown: ['num', 'denom']
        },
        entry: {
            fromLeft: {
                up: ['num'],
                right: ['num'],
                down: ['denom']
            },
            fromRight: {
                up: ['num'],
                left: ['num'],
                down: ['denom']
            }
        }
    }
};
