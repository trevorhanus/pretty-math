import classNames from 'classnames';
import { PrinterOutput } from 'pretty-math2/internal';
import type { Block, BlockList, Editor, HandlerResponse, IBlockConfig } from 'pretty-math2/internal';
import React from 'react';

export interface DifferentialBlockData {
    displayValue: string;
}

export interface DifferentialBlockChildren {
    inner: BlockList;
}

export type DifferentialBlockChildNames = 'inner';
export type DifferentialBlock = Block<DifferentialBlockData, DifferentialBlockChildNames>;

export const differentialBlockConfig: IBlockConfig<DifferentialBlock> = {
    type: 'math:differential',

    render: ({ block, children, style }) => {
        let classes = classNames(
            'inner',
            { 'has-focus': block.childMap.inner.contains(block.editor.selection.focus) }
        );
        return (
            <span className="differential">
                <span>{block.data.displayValue}</span>
                <span className={classes}>
                    {children.inner}
                </span>
            </span>
        );
    },

    printers: {
        calchub: ({ block, children }) => {
            const val = block.data.displayValue === 'd' ? '\\wrt' : '\\pwrt';
            return PrinterOutput.fromMany([
                { text: val + '{', source: block },
                children.inner,
                { text: '}', source: block}
            ]);
        },
        python: ({ block, children }) => {
            return PrinterOutput.fromMany([
                children.inner
            ]);
        }
    },

    composite: {
        children: {
            inner: {
                canBeNull: false,
                childNumber: 0
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
                up: [],
                right: ['inner'],
                down: []
            },
            fromRight: {
                up: [],
                left: ['inner'],
                down: []
            },
        },
        handleRemoveOutOf: (block: DifferentialBlock, childList: string, editor: Editor): HandlerResponse => {
            editor.selection.anchorAt(block.next);
            block.list.removeBlock(block);
            return 'handled';
        }
    }
};
