import { expect } from 'chai';
import { EntryType, LibraryEntry, Library } from 'pretty-math/internal';

describe('Library', () => {

    it('search for \'si\'', () => {
        const library = new Library(null);
        const results = library.search('si');
        expect(results.length).to.be.greaterThan(1);
        expect(results[0]).to.deep.include({
            keyword: 'sin',
            latex: '\\sin',
        });
    });

    it('can add an entry and find it', () => {
        const library = new Library(null);

        const entryJS = {
            keywords: ['foo'],
            descr: 'foo',
            text: 'foo',
            latex: 'foo',
        };

        library.addEntry(new LibraryEntry(EntryType.Func, entryJS));

        const results = library.search('fo');

        expect(results[0]).to.deep.include(entryJS);
    });
});
