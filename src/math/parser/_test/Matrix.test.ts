import { expect } from 'chai';
import { MatrixNode, parseCalchub } from '../../internal';

describe('Matrix', () => {

    it('parse', () => {
        [
            {
                expr: '\\matrix{[[1],[2]]}',
                nRows: 2,
                nCols: 1,
                shorthand: {
                    op: '\\matrix',
                    left: {
                        op: '[]',
                        items: [
                            {
                                op: '[]',
                                items: ['1']
                            },
                            {
                                op: '[]',
                                items: ['2']
                            }
                        ]
                    }
                }
            },
            {
                expr: '\\matrix{[[1,2],[3,4]]}',
                nRows: 2,
                nCols: 2,
                shorthand: {
                    op: '\\matrix',
                    left: {
                        op: '[]',
                        items: [
                            {
                                op: '[]',
                                items: ['1', '2']
                            },
                            {
                                op: '[]',
                                items: ['3', '4']
                            }
                        ]
                    }
                }
            },
            {
                expr: '\\matrix{[[1+3,2^{x}]]}',
                nRows: 1,
                nCols: 2,
                shorthand: {
                    op: '\\matrix',
                    left: {
                        op: '[]',
                        items: [
                            {
                                op: '[]',
                                items: [
                                    {
                                        op: '+',
                                        left: '1',
                                        right: '3'
                                    },
                                    {
                                        op: '^',
                                        left: '2',
                                        right: 'x'
                                    },
                                ]
                            },
                        ]
                    }
                }
            }
        ].forEach(test => {
            const { expr, shorthand, nRows, nCols } = test;
            const { root } = parseCalchub(expr);
            const m = root.only as MatrixNode;
            expect(shorthand).to.deep.eq(m.toShorthand());
            expect(m.nCols).to.eq(nCols);
            expect(m.nRows).to.eq(nRows);
        });
    });

});
