import React from 'react';
import { Block, BlockList } from 'pretty-math2/model';
import { IBlockConfig } from 'pretty-math2/interfaces';
import { PrinterOutput } from '../utils/PrinterOutput';

export interface IntegralBlockData {}
export interface IntegralBlockChildren {
    inner: BlockList;
    leftBound: BlockList;
    rightBound: BlockList;
    wrt: BlockList;
}

export type IntegralBlockChildNames = 'inner' | 'leftBound' | 'rightBound' | 'wrt';
export type IntegralBlock = Block<IntegralBlockData, IntegralBlockChildNames>;

export const integralBlockConfig: IBlockConfig<IntegralBlock> = {
    type: 'math:integral',

    render: ({ block, children, style }) => (
        <span
            className='integral'
            style={style}
        >
            <span className='integral-symbol'>
                <span>∫</span>
            </span>
            <span className="integral-bounds">
                <span className="right-bound">{children.rightBound}&#8203;</span>
                <span className="left-bound">{children.leftBound}&#8203;</span>
            </span>
            <span className="inner">{children.inner}</span>
            <span className="wrt">
                <span>d</span>
                {children.wrt}
            </span>
        </span>
    ),

    printers: {
        calchub: ({ block, children }) => {
            let bounds: PrinterOutput;

            if (children.leftBound != null) {
                bounds = PrinterOutput.fromMany([
                    children.leftBound,
                    { text: ',', source: this },
                ]);
            }
    
            if (children.rightBound != null) {
                bounds = bounds.append(children.rightBound);
            }

            return PrinterOutput.fromMany([
                { text: '\\int{', source: block },
                children.inner,
                { text: ',', source: block },
                children.wrt,
                bounds && { text: ',', source: block },
                bounds,
                { text: '}', source: block }
            ]);
        },
        python: ({ block, children }) => {
            let bounds: PrinterOutput;

            if (children.leftBound != null) {
                bounds = PrinterOutput.fromMany([
                    children.leftBound,
                    { text: ',', source: this },
                ]);
            }
    
            if (children.rightBound != null) {
                bounds = bounds.append(children.rightBound);
            }

            return PrinterOutput.fromMany([
                { text: 'integrate(', source: block },
                children.inner,
                { text: ',', source: block },
                bounds && { text: '(', source: block },
                children.wrt,
                bounds && { text: ',', source: block },
                bounds,
                bounds && { text: ')', source: block },
                { text: ')', source: block }
            ]);
        }
    },

    composite: {
        children: {
            leftBound: {
                canBeNull: true,
                childNumber: 0
            },
            rightBound: {
                canBeNull: true,
                childNumber: 1
            },
            inner: {
                canBeNull: false,
                childNumber: 2
            },
            wrt: {
                canBeNull: false,
                childNumber: 3
            }
        },
        cursorOrder: {
            right: {
                'leftBound': 'inner',
                'rightBound': 'inner',
                'inner': 'wrt',
            },
            left: {
                'inner': 'rightBound',
                'wrt': 'inner'
            },
            up: {
                'leftBound': 'rightBound',
                'inner': 'rightBound',
            },
            down: {
                'rightBound': 'leftBound',
                'inner': 'leftBound',
            }
        },
        entry: {
            fromLeft: {
                up: ['rightBound'],
                right: ['rightBound', 'inner'],
                down: ['leftBound']
            },
            fromRight: {
                up: [],
                left: ['wrt'],
                down: []
            }
        }
    }
};
