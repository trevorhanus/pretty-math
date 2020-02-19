import { expect } from 'chai';
import { tokenizeCalchub, toShorthand } from '../../../../internal';

describe('CalchubTokenizer', () => {

    it('general', () => {
        [
            {
                expr: '75.08x',
                shorthand: '[l:75.08] [s:x]',
            },
            // {
            //     expr: '\u03C3 * x',
            //     shorthand: '[s:\u03C3] [ ] [*] [ ] [s:x]',
            // },
            {
                expr: 'derp7508',
                shorthand: '[s:derp7508]',
            },
            {
                expr: '(9)',
                shorthand: '[(] [l:9] [)]',
            },
            {
                expr: '(9))',
                shorthand: '[(] [l:9] [)] [)]',
            },
            {
                expr: '7/5',
                shorthand: '[l:7] [/] [l:5]',
            },
            {
                expr: '75.08*x',
                shorthand: '[l:75.08] [*] [s:x]',
            },
            // {
            //     expr: `1\\sin(${UC.alpha})`,
            //     shorthand: `[l:1] [sin] [(] [s:${UC.alpha}] [)]`,
            // },
            {
                expr: '(5)',
                shorthand: '[(] [l:5] [)]',
            },
            {
                expr: '\\sin(gamma)',
                shorthand: '[sin] [(] [s:gamma] [)]',
            },
            {
                expr: 'sin',
                shorthand: '[s:sin]',
            },
            {
                expr: 'sina',
                shorthand: '[s:sina]',
            },
            {
                expr: '*',
                shorthand: '[*]',
            },
            {
                expr: '2\\pi',
                shorthand: '[l:2] [c:\\pi]'
            },
            {
                expr: '(a + 1)5',
                shorthand: '[(] [s:a] [ ] [+] [ ] [l:1] [)] [l:5]'
            },
            {
                expr: '(a + 1)(a)',
                shorthand: '[(] [s:a] [ ] [+] [ ] [l:1] [)] [(] [s:a] [)]'
            },
            {
                expr: '(a + 1) (a)',
                shorthand: '[(] [s:a] [ ] [+] [ ] [l:1] [)] [ ] [(] [s:a] [)]'
            },
            {
                expr: '2(a)',
                shorthand: '[l:2] [(] [s:a] [)]'
            },
            {
                expr: 'x(a)',
                shorthand: '[s:x] [(] [s:a] [)]'
            },
            {
                expr: '5\\sin(a)',
                shorthand: '[l:5] [sin] [(] [s:a] [)]'
            },
            {
                expr: '8(',
                shorthand: '[l:8] [(]'
            },
            {
                expr: '(1/4)e^0',
                shorthand: '[(] [l:1] [/] [l:4] [)] [c:e] [^] [l:0]'
            },
            {
                expr: '{}',
                shorthand: '[{] [}]',
            },
            {
                expr: '\\{\\}',
                shorthand: '[\\{] [\\}]',
            },
            {
                expr: '(\\{}])',
                shorthand: '[(] [\\{] [}] []] [)]',
            },
            {
                expr: 'a_{i}',
                shorthand: '[s:a_] [{] [s:i] [}]',
            },
            {
                expr: 's_1',
                shorthand: '[s:s_1]',
            },
            {
                expr: 's_{1a}',
                shorthand: '[s:s_] [{] [l:1] [s:a] [}]',
            },
            {
                expr: 's_00fh   a',
                shorthand: '[s:s_00fh] [ ] [s:a]',
            },
            {
                expr: 's1_h+a',
                shorthand: '[s:s1_h] [+] [s:a]',
            },
            {
                expr: 'a_1_1',
                shorthand: '[s:a_1_1]',
            },
            {
                expr: '\\frac{1,2}',
                shorthand: '[frac] [{] [l:1] [,] [l:2] [}]',
            },
        ].forEach(test => {
            const { shorthand, expr } = test;
            const { tokens } = tokenizeCalchub(expr);
            expect(toShorthand(tokens), `error at ${expr}`).to.eq(shorthand);
        });
    });
});
