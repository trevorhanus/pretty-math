import { expect } from 'chai';
import { MathContext, MathExpr } from 'math';
import { AssistantLibrary, LibraryTab, MathEngine } from 'pretty-math/internal';

describe('AssistantLibrary', () => {

    it('tabsToRender: no mathCxt', () => {
        const mathEngine = new MathEngine();
        const assLib = new AssistantLibrary(mathEngine);
        expect(assLib.tabsToRender).to.deep.eq([
            LibraryTab.Suggested,
            LibraryTab.Trig,
            LibraryTab.Functions,
            LibraryTab.Greek,
        ]);
    });

    it('tabsToRender: with mathCxt', () => {
        const mathCxt = new MathContext();
        const mathEngine = new MathEngine(mathCxt);
        const assLib = new AssistantLibrary(mathEngine);
        expect(assLib.tabsToRender).to.deep.eq([
            LibraryTab.Suggested,
            LibraryTab.Vars,
            LibraryTab.Trig,
            LibraryTab.Functions,
            LibraryTab.Greek,
        ]);
    });

    it('do not suggest a variable if it is currently the focused token', () => {
        const mathCxt = new MathContext();
        const a = new MathExpr();
        a.updateExpr('a = 10');
        mathCxt.addExpr(a);

        const mathEngine = new MathEngine(mathCxt);
        mathEngine.handler.insertText('a');

        const suggestions = mathEngine.assistant.library.suggestedEntries;

        const focusedTokenEntry = suggestions.slice(1);
        expect(suggestions.every(e => e.text !== 'a')).to.be.true;
    });
});
