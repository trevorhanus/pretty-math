import classNames from 'classnames';
import { INode, isBinaryOpFam, isCommaNode, isConstantFam, isLeftParensFam, isPowerNode, isRightParensFam, isSymbolFam } from 'math';
import { PrinterOutput } from 'pretty-math/internal';
import type { Block, IBlockConfig } from 'pretty-math/internal';
import React from 'react';

export interface AtomicBlockData {
    text: string;
}

export type AtomicBlock = Block<AtomicBlockData>;

export const atomicBlockConfig: IBlockConfig<AtomicBlock> = {
    type: 'atomic',

    render: ({ block, style }) => {
        const className = classNames(
            getMathClassName(block),
        );

        const text = getMathDisplayValue(block);

        return (
            <span
                className={className}
                style={style}
            >
                {text}
            </span>
        );
    },

    printers: {
        calchub: props => {
            return PrinterOutput.fromOne({
                source: props.block,
                text: props.block.data.text,
            });
        },
        python: props => {
            return PrinterOutput.fromOne({
                source: props.block,
                text: props.block.data.text,
            });
        }
    },
};

function getMathClassName(block: Block): string {
    if (block.mode !== 'math') {
        return '';
    }

    const node = block.mathNode;

    if (!node) {
        return '';
    }

    const classes: string[] = [];

    switch (true) {

        case isBinaryOpFam(node):
            classes.push(...classNamesForBinaryOp(node));
            break;

        case isLeftParensFam(node):
            classes.push('parens', 'left-parens');
            break;

        case isRightParensFam(node):
            classes.push('parens', 'right-parens');
            break;

        case isConstantFam(node):
        case isSymbolFam(node):
            classes.push('symbol');
            break;

    }

    return classes.join(' ');
}

function classNamesForBinaryOp(node: INode): string[] {
    let classes = ['binary-op'];

    if (isCommaNode(node)) {
        classes.push('no-padding-left');
    }

    if (isPowerNode(node)) {
        return ['no-padding'];
    }

    // if (token.value === '_' || token.value === '^') {
    //     return ['no-padding'];
    // }

    return classes;
}

function getMathDisplayValue(block: Block): string {
    let text = block.data.text;

    if (block.mode !== 'math') {
        return text;
    }

    if (text === '*') {
        return '\u22c5';
    }

    if (text === '-' && isBinaryOpFam(block.mathNode)) {
        return '\u2212';
    }

    return text;
}
