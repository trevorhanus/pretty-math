import { expect } from 'chai';
import { IntegralNode, NodeType, parseCalchub, TokenName } from '../../internal';

describe('IntegralNode', () => {

    it('basic test', () => {
        const expr = '\\int{x^2,\\wrt{x},-1,1}';
        const { root } = parseCalchub(expr);

        const node = root.only as IntegralNode;
        expect(node.isSymbolic).to.be.true;
        expect(node.type).to.eq(NodeType.Operator);
        expect(node).to.be.an.instanceOf(IntegralNode);

        expect(node.expression.toShorthand()).to.deep.eq({
            op: '^',
            left: 'x',
            right: '2',
        });

        expect(node.wrt.toShorthand()).to.deep.eq({
            op: '\\wrt',
            left: 'x',
        });

        expect(node.leftBound.toShorthand()).to.deep.eq({
            op: 'neg',
            left: '1',
        });

        expect(node.rightBound.toShorthand()).to.deep.eq('1');
    });

    it('no bounds', () => {
        const expr = '\\int{x^2,\\wrt{x}}';
        const { root } = parseCalchub(expr);

        const node = root.only as IntegralNode;
        expect(node.isSymbolic).to.be.true;
        expect(node.type).to.eq(NodeType.Operator);
        expect(node.tokenName).to.eq(TokenName.Integral);
        expect(node).to.be.an.instanceOf(IntegralNode);

        expect(node.expression.toShorthand()).to.deep.eq({
            op: '^',
            left: 'x',
            right: '2',
        });

        expect(node.wrt.toShorthand()).to.deep.eq({
            op: '\\wrt',
            left: 'x',
        });

        expect(node.leftBound).to.eq(null);
        expect(node.rightBound).to.eq(null);
    });

    it('expression in bounds', () => {
        const expr = '\\int{\\sqrt{x-4},\\wrt{x},x-8,x+8}';
        const { root } = parseCalchub(expr);

        const node = root.only as IntegralNode;

        expect(node.expression.toShorthand()).to.deep.eq({
            op: '\\sqrt',
            left: {
                op: '-',
                left: 'x',
                right: '4',
            },
        });

        expect(node.wrt.toShorthand()).to.deep.eq({
            op: '\\wrt',
            left: 'x',
        });

        expect(node.leftBound.toShorthand()).to.deep.eq({
            op: '-',
            left: 'x',
            right: '8',
        });

        expect(node.rightBound.toShorthand()).to.deep.eq({
            op: '+',
            left: 'x',
            right: '8',
        });
    });

});
