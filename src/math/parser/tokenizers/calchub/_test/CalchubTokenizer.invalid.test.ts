import { expect } from 'chai';
import { MathSyntaxError, tokenizeCalchub } from '../../../../internal';

describe('CalchubTokenizer:invalid', () => {

    it('invalid', () => {
        [
            {
                expr: '\u0250',
            },
            {
                expr: '😃😈',
            },
            {
                expr: '@',
            },
            {
                expr: '#',
            },
            // {
            //     expr: '...',
            // },
        ].forEach(test => {
            const { expr } = test;
            const { error, tokens } = tokenizeCalchub(expr);
            expect(error).to.be.instanceOf(MathSyntaxError);
        });
    });
});
