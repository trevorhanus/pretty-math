import React from 'react';
import {
    Block,
    copyBlocksInChild,
    Editor,
    HandlerResponse,
    IBlockConfig,
    insertBlocksToRight,
    PrinterOutput
} from 'pretty-math/internal';
import { toHex } from 'common';

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

            if (!block.childMap.sub.isNull) {
                subscipt = PrinterOutput.fromMany([
                    { text: '_', source: block },
                    PrinterOutput.expandToHex(children.sub)
                ]);
            }

            let superscript: PrinterOutput;

            if (!block.childMap.sup.isNull) {
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
        },
        handleRemoveOutOf: (block: SupSubBlock, childList: string, editor: Editor): HandlerResponse => {
            let handled: HandlerResponse = 'not_handled';
            if (childList === 'sup') {
                if (block.childMap.sup.isEmpty) {
                    block.childMap.sup.removeBlock(block.childMap.sup.start);
                    editor.selection.anchorAt(block);
                    handled = 'handled';
                }
                if (block.childMap.sub.isNull) {
                    const blocks = copyBlocksInChild(block, 'sup');
                    insertBlocksToRight(block, blocks);
                    editor.selection.anchorAt(block.next);
                    block.list.removeBlock(block);
                    handled = 'handled';
                }
            }
            if (childList === 'sub') {
                if (block.childMap.sub.isEmpty) {
                    block.childMap.sub.removeBlock(block.childMap.sub.start);
                    editor.selection.anchorAt(block);
                    handled = 'handled';
                }
                if (block.childMap.sup.isNull) {
                    const blocks = copyBlocksInChild(block, 'sub');
                    insertBlocksToRight(block, blocks);
                    editor.selection.anchorAt(block.next);
                    block.list.removeBlock(block);
                    handled = 'handled';
                }
            }
            if (block.childMap.sub.isNull && block.childMap.sup.isNull) {
                editor.selection.anchorAt(block.next);
                block.list.removeBlock(block);
            }
            return handled;
        }
    }
};
