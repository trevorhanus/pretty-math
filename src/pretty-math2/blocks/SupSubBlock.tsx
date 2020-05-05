import { IBlockConfig } from 'pretty-math2/interfaces';
import { Block } from 'pretty-math2/model';
import { PrinterOutput } from 'pretty-math2/utils/PrinterOutput';
import React from 'react';

export interface SupSubBlockData {}
export type SupSubBlockChildNames = 'sup' | 'sub';
export type SupSubBlock = Block<SupSubBlockData, SupSubBlockChildNames>;

export const supSubBlockConfig: IBlockConfig<SupSubBlock> = {
    type: 'math:supsub',

    render: ({ children }) => (
        <span className="sup-sub">
            <span className="sup">{children.sup}&#8203;</span>
            <span className="middle-base">
                <span className="inline" />
            </span>
            <span className="sub">{children.sub}&#8203;</span>
        </span>
    ),

    printers: {
        calchub: ({ block, children }) => {
            let subscipt: PrinterOutput;

            if (!block.childMap.sub.isEmpty) {
                subscipt = PrinterOutput.fromMany([
                    { text: '_{', source: block },
                    children.sub,
                    { text: '}', source: block }
                ]);
            }

            let superscript: PrinterOutput;

            if (!block.childMap.sup.isEmpty) {
                superscript = PrinterOutput.fromMany([
                    { text: '^{', source: block },
                    children.sup,
                    { text: '}', source: block }
                ]);
            }

            return PrinterOutput.fromMany([
                subscipt,
                superscript
            ]);
        },
        python: ({ block, children }) => {
            return PrinterOutput.fromMany([
                { text: '_', source: block },
                PrinterOutput.expandToHex(children.sub),
                { text: '**', source: block },
                children.sup
            ]);
        },
    },

    composite: {
        children: {
            sub: {
                canBeNull: true,
                childNumber: 0
            },
            sup: {
                canBeNull: true,
                childNumber: 1
            }
        },
        cursorOrder: {
            right: {},
            left: {},
            up: {
                'sub': 'sup'
            },
            down: {
                'sup': 'sub'
            }
        },
        entry: {
            fromLeft: {
                up: ['sup', 'sub'],
                right: ['sub', 'sup'],
                down: ['sub', 'sup']
            },
            fromRight: {
                up: ['sup', 'sub'],
                left: ['sub', 'sup'],
                down: ['sub', 'sup']
            }
        }
    }
};
