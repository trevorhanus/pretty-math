import { expect } from 'chai';
import { tokenizePython, toShorthand } from '../../../../internal';

describe('PythonTokenizer.general', () => {

    it('works', () => {
        [
            {
                expr: '-9/x**2',
                shorthand: '[-] [l:9] [/] [s:x] [^] [l:2]',
            },
        ].forEach(test => {
            const { shorthand, expr } = test;
            const { tokens } = tokenizePython(expr);
            expect(toShorthand(tokens), `error at ${expr}`).to.eq(shorthand);
        });
    });
});
