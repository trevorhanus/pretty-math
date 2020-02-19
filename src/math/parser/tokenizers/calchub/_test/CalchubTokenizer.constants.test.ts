import { expect } from 'chai';
import { tokenizeCalchub, toShorthand } from '../../../../internal';

describe('CalchubTokenizer:constants', () => {

    it('constants', () => {
        [
            {
                expr: '\\pi',
                shorthand: '[c:\\pi]',
            },
            {
                expr: 'e',
                shorthand: '[c:e]',
            },
            {
                expr: '\\inf',
                shorthand: '[∞]',
            },
        ].forEach(test => {
            const { shorthand, expr } = test;
            const { tokens } = tokenizeCalchub(expr);
            expect(toShorthand(tokens), `error at ${expr}`).to.eq(shorthand);
        });
    });
});
