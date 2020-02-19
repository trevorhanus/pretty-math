import { CSSProperties } from 'react';
import { MathContext } from 'math';
import {
    INode,
    isBinaryOpFam,
    isCommaNode,
    isConstantFam,
    isLeftParensFam,
    isPowerNode,
    isRightParensFam,
    isSymbolFam,
    isSymbolNode
} from 'math';
import { IBlock, IBlockDecor } from 'pretty-math/internal';

export class MathBlockDecor implements IBlockDecor {
    readonly node: INode;
    readonly mathCxt: MathContext;
    readonly block: IBlock;

    constructor(node: INode, block: IBlock, mathCxt?: MathContext) {
        this.node = node;
        this.mathCxt = mathCxt;
        this.block = block;
    }

    get className(): string {
        if (!this.node) {
            return '';
        }

        const classes: string[] = [];

        switch (true) {

            case isBinaryOpFam(this.node):
                classes.push(...classNamesForBinaryOp(this.node));
                break;

            case isLeftParensFam(this.node):
                classes.push('parens', 'left-parens');
                break;

            case isRightParensFam(this.node):
                classes.push('parens', 'right-parens');
                break;

            case isConstantFam(this.node):
            case isSymbolFam(this.node):
                classes.push('symbol');
                break;

        }

        return classes.join(' ');
    }

    get displayValueOverride(): string {
        if (!this.node) {
            return null;
        }

        const { tokenValue } = this.node;

        switch (true) {

            case tokenValue === '*':
                return '\u22c5';

            case tokenValue === '-' && isBinaryOpFam(this.node):
                return '\u2212';

            default:
                return null;
        }
    }

    get style(): CSSProperties {
        const style: CSSProperties = {};

        if (!this.node) {
            return style;
        }

        if (isSymbolNode(this.node) && !this.node.isLocal && this.mathCxt) {
            const val = this.node.symbol;
            const expr = this.mathCxt.getVar(val);
            if (expr) {
                style.color = expr.color.rgbStr;
            }
        }

        return style;
    }
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
