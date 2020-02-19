import { expect } from 'chai';
import { tokenizeCalchub } from '../../../../internal';

describe('CalchubTokenizer:Start and End', () => {

    it('start and end', () => {
        [
            {
                expr: '75',
                bounds: [[0, 1]],
            },
            {
                expr: '75.1523 4',
                bounds: [[0, 6], [7, 7], [8 ,8]],
            },
            {
                expr: '1.2e12',
                bounds: [[0, 5]],
            },
            {
                expr: '\\sin',
                bounds: [[0, 3]],
            },
            {
                expr: '\\alpha',
                bounds: [[0, 5]],
            },
            {
                expr: '\\dfunc{f,x}=x',
                bounds: [[0, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11], [12, 12]],
            },
            {
                expr: 'x+2*4',
                bounds: [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]],
            },
            {
                expr: 't_rev',
                bounds: [[0, 4]],
            },
            {
                expr: 't  x',
                bounds: [[0, 0], [1, 2], [3, 3]],
            },
        ].forEach(test => {
            const { bounds, expr } = test;
            const { tokens } = tokenizeCalchub(expr);
            tokens.forEach((token, i) => {
                const [ start, end ] = bounds[i];
                expect(token.start).to.eq(start);
                expect(token.end).to.eq(end);
            });
        });
    });

});
