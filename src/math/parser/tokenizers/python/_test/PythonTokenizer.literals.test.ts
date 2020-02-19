import { expect } from 'chai';
import { ErrorCode, tokenizePython, toShorthand } from '../../../../internal';

describe('PythonTokenizer:Literals', () => {

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
        ].forEach(test => {
            const { shorthand, expr } = test;
            const { tokens } = tokenizePython(expr);
            expect(toShorthand(tokens), `error at ${expr}`).to.eq(shorthand);
        });
    });

    xit('literal errors', () => {
        [
            {
                expr: '75e1.2',
                code: ErrorCode.UnexpectedChar,
                message: `E-notation can only contain integers.`,
                shorthand: '[l,75e1.2]',
            },
            {
                expr: '75e',
                code: ErrorCode.MissingChar,
                message: `'75e' is invalid. Enter a number after the 'e'.`,
                shorthand: '[l,75e]',
            },
            {
                expr: '...',
                code: ErrorCode.MissingChar,
                message: `'75e' is invalid. Enter a number after the 'e'.`,
                shorthand: '[l,75e]',
            },
        ].forEach(test => {
            const { expr, message, code, shorthand } = test;
            const { tokens, warnings } = tokenizePython(expr);
            expect(warnings[0].message).to.eq(message);
            expect(toShorthand(tokens), `error at ${expr}`).to.eq(shorthand);
        });
    });

});
