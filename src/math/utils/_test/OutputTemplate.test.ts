import { expect } from 'chai';
import { outputFromString, OutputTemplate } from '../../internal';

describe('OutputTemplate', () => {

    it('happy path', () => {
        const template = '(s$0 b$1)';
        const source1 = 's1';
        const source2 = 's2';
        const source3 = 's3';

        const t = new OutputTemplate(template, source1);
        const output = t.buildOutput([outputFromString('up,', source2), outputFromString('itch', source3)]);

        expect(output.expr).to.eq('(sup, bitch)');
        expect(output.sourceMap.join(' ')).to.eq('s1 s1 s2 s2 s2 s1 s1 s3 s3 s3 s3 s1');
    });

    it('template with no placeholders', () => {
        const template = '(sup)';
        const source1 = 's1';
        const source2 = 's2';

        const t = new OutputTemplate(template, source1);
        const output = t.buildOutput([outputFromString('foo', source2)]);

        expect(output.expr).to.eq('(sup)');
        expect(output.sourceMap.join(' ')).to.eq('s1 s1 s1 s1 s1');
    });
});
