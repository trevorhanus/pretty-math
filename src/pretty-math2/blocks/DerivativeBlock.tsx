import React from 'react';
import { IBlockConfig } from 'pretty-math2/interfaces';
import { Block, BlockList } from 'pretty-math2/model';
import { PrinterOutput } from '../utils/PrinterOutput';

export interface DerivativeBlockData {
    differentialValue: string;
    derivativeOrder: number;
}
export interface DerivativeBlockChildren {
    inner: BlockList;
    wrt: BlockList;
}

export type DerivativeBlockChildNames = 'inner' | 'wrt';
export type DerivativeBlock = Block<DerivativeBlockData, DerivativeBlockChildNames>;

export const derivativeBlockConfig: IBlockConfig<DerivativeBlock> = {
    type: 'math:derivative',

    render: ({ block, children, style }) => (
        <span className="derivative">
            <span className="fraction">
                <span className="numerator">
                    <span className="block italic">{block.data.differentialValue}</span>
                    {
                        block.data.derivativeOrder > 1 && (
                            <span className="sup-sub">
                                <span className="sup">
                                    <span className="block">{block.data.derivativeOrder}</span>
                                </span>
                                <span className="middle-base">
                                    <span className="inline" />
                                </span>
                            </span>
                        )
                    }
                </span>
                <span className="fraction-line"><span className="line" /></span>
                <span className='denominator'>
                    <span className="block italic">{block.data.differentialValue}</span>
                    {children.wrt}
                </span>
            </span>
            <span>(</span>
            <span className='inner'>{children.inner}</span>
            <span>)</span>
        </span>
    ),

    printers: {
        calchub: ({ block, children }) => {
            return PrinterOutput.fromMany([
                { text: '\\diff{', source: block },
                children.inner,
                { text: ',', source: block },
                children.wrt,
                { text: '}', source: block }
            ]);
        },
        python: ({ block, children }) => {
            return PrinterOutput.fromMany([
                { text: 'diff(', source: block },
                children.inner,
                { text: ',', source: block },
                children.wrt,
                { text: ',', source: block },
                { text: `${block.data.derivativeOrder})`, source: block}
            ]);
        }
    },

    composite: {
        children: {
            wrt: {
                canBeNull: false,
                childNumber: 0
            },
            inner: {
                canBeNull: false,
                childNumber: 1
            }
        },
        cursorOrder: {
            right: {
                'wrt': 'inner'
            },
            left: {
                'inner': 'wrt'
            },
            up: {
                'wrt': 'inner'
            },
            down: {
                'inner': 'wrt'
            }
        },
        entry: {
            fromLeft: {
                up: [],
                right: ['wrt'],
                down: ['wrt']
            },
            fromRight: {
                up: [],
                left: ['inner'],
                down: []
            }
        }
    }
};