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
        calchub: ({ block, children }) => {
            return PrinterOutput.fromMany([
                { text: '\\frac{', source: block },
                children.num,
                { text: ',', source: block },
                children.denom,
                { text: '}', source: block },
            ]);
        },
        python: ({ block, children }) => {
            return PrinterOutput.fromMany([
                { text: '(', source: block },
                children.num,
                { text: ')/(', source: block },
                children.denom,
                { text: ')', source: block },
            ]);
        }
    },

    composite: {
        children: {
            num: {
                canBeNull: false,
                childNumber: 0
            },
            denom: {
                canBeNull: false,
                childNumber: 1
            }
        },
        cursorOrder: {
            right: {},
            left: {},
            up: {
                'denom': 'num'
            },
            down: {
                'num': 'denom'
            }
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
