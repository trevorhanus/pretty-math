import React from 'react';
import {
    Block,
    BlockFactory,
    copyBlocksInChild,
    Editor,
    IBlockConfig,
    insertBlocksToLeft,
    insertBlocksToRight,
    PrinterOutput
} from 'pretty-math/internal';

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
        },
        handleRemoveOutOf: (block: FractionBlock, childList: string, editor: Editor): 'handled' | 'not_handled' => {
            if (childList === 'num' && block.childMap.denom.isEmpty) {
                const blocks = copyBlocksInChild(block, 'num');
                insertBlocksToRight(block, blocks);
                editor.selection.anchorAt(block.next);
                block.list.removeBlock(block);
                return 'handled';
            }
            if (childList === 'denom') {
                const numBlocks = copyBlocksInChild(block, 'num');
                insertBlocksToLeft(block, numBlocks);
                const denomBlocks = copyBlocksInChild(block, 'denom');
                insertBlocksToRight(block, denomBlocks);
                const newBlock = BlockFactory.createBlock('atomic', { text: '/' });
                block.list.insertBlock(block, newBlock);
                editor.selection.anchorAt(block.next);
                block.list.removeBlock(block);
                return 'handled';
            }
            return 'not_handled';
        }
    }
};
