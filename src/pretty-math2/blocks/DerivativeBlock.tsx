import React from 'react';
import { Block, BlockList } from 'pretty-math2/model';
import { copyBlocksInChild, insertBlocksToRight } from 'pretty-math2/utils/BlockUtils';
import { Editor } from 'pretty-math2/model/Editor';
import { extractDifferentialSymbolNames, parseCalchub } from 'math';
import { HandlerResponse, IBlockConfig } from 'pretty-math2/interfaces';
import { PrinterOutput } from '../utils/PrinterOutput';

export interface DerivativeBlockData {}
export interface DerivativeBlockChildren {
    inner: BlockList;
    wrt: BlockList;
}

export type DerivativeBlockChildNames = 'inner' | 'wrt';
export type DerivativeBlock = Block<DerivativeBlockData, DerivativeBlockChildNames>;

export const derivativeBlockConfig: IBlockConfig<DerivativeBlock> = {
    type: 'math:derivative',

    render: ({ block, children, style }) => {
        let derivativeOrder = 0;
        try {
            const { root } = parseCalchub(block.childMap.wrt.toCalchub().text);
            const diffSymbols = extractDifferentialSymbolNames(root);
            if (diffSymbols) {
                derivativeOrder = diffSymbols.length;
            }
        } catch (e) {

        }

        let differentialValue = 'd';
        block.childMap.wrt.blocks.forEach(b => {
            if (b.data.displayValue === '∂') {
                differentialValue = '∂';
            }
        });

        return (
            <span className="derivative">
                <span className="fraction">
                    <span className="numerator">
                        <span className="block italic">{differentialValue}</span>
                        {
                            derivativeOrder > 1 && (
                                <span className="sup-sub">
                                    <span className="sup">
                                        <span className="block">{derivativeOrder}</span>
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
                        {children.wrt}
                    </span>
                </span>
                <span>(</span>
                <span className='inner'>{children.inner}</span>
                <span>)</span>
            </span>
        );
    },

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
            const derivativeOrder = 1;

            return PrinterOutput.fromMany([
                { text: 'diff(', source: block },
                children.inner,
                { text: ',', source: block },
                children.wrt,
                { text: ',', source: block },
                { text: `${derivativeOrder})`, source: block}
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
        },
        handleRemoveOutOf: (block: DerivativeBlock, childList: string, editor: Editor): HandlerResponse => {
            const blocks = copyBlocksInChild(block, 'inner');
            insertBlocksToRight(block, blocks);
            editor.selection.anchorAt(block.next);
            block.list.removeBlock(block);
            return 'handled';
        }
    }
};
