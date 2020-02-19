import { expect } from 'chai';
import { tokenizeCalchub, toShorthand } from '../../../../internal';

describe('CalchubTokenizer:Literals', () => {

    it('literals', () => {
        [
            {
                expr: '75',
                shorthand: '[l:75]',
            },
            {
                expr: '75.1523 4',
                shorthand: '[l:75.1523] [ ] [l:4]',
            },
            {
                expr: '075.0100',
                shorthand: '[l:075.0100]',
            },
            {
                expr: '1e10',
                shorthand: '[l:1e10]',
            },
            {
                expr: '5e-1',
                shorthand: '[l:5e-1]',
            },
        ].forEach(test => {
            const { shorthand, expr } = test;
            const { tokens } = tokenizeCalchub(expr);
            expect(toShorthand(tokens), `error at ${expr}`).to.eq(shorthand);
        });
    });

    it('literal warnings', () => {
        [
            {
                expr: '75e1.2',
                message: `Invalid number '75e1.2'`,
                shorthand: '[l:75e1.2]',
            },
            {
                expr: '75e',
                message: `Invalid number '75e'`,
                shorthand: '[l:75e]',
            },
            {
                expr: '...',
                message: `Invalid number '...'`,
                shorthand: '[l:...]',
            },
        ].forEach(test => {
            const { expr, message, shorthand } = test;
            const { tokens, warnings } = tokenizeCalchub(expr);
            expect(warnings[0].message).to.eq(message);
            expect(toShorthand(tokens), `error at ${expr}`).to.eq(shorthand);
        });
    });

});
