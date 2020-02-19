import { expect } from 'chai';
import { tokenizePython, toShorthand } from '../../../../internal';

describe('PythonTokenizer:constants', () => {

    it('constants', () => {
        [
            {
                expr: 'PI',
                shorthand: '[c:PI]',
            },
        ].forEach(test => {
            const { shorthand, expr } = test;
            const { tokens } = tokenizePython(expr);
            expect(toShorthand(tokens), `error at ${expr}`).to.eq(shorthand);
        });
    });
});
