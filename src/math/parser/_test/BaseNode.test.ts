import { expect } from 'chai';
import { BaseNode, Token } from '../../internal';

describe('BaseNode', () => {

    it('clone', () => {
        const token = {} as Token;
        const n = new BaseNode({ token });
        const n1 = n.clone();
        expect(n).to.not.eq(n1);
        expect(n.token).to.eq(n1.token);
        expect(n.type).to.eq(n1.type);
    });

    it('addChild', () => {
        const p = new BaseNode({});
        const c1 = new BaseNode({});
        const c2 = new BaseNode({});

        expect(p.children).to.deep.eq([]);

        p.addChild(c1);
        expect(p.children).to.deep.eq([c1]);

        p.addChild(c2);
        expect(p.children).to.deep.eq([c1, c2]);
    });

    it('replaceChild', () => {
        const p = new BaseNode({});
        const c1 = new BaseNode({});
        const c2 = new BaseNode({});

        p.addChild(c1);
        expect(p.children).to.deep.eq([c1]);
        expect(c1.parent).to.eq(p);

        p.replaceChild(c1, c2);
        expect(p.children).to.deep.eq([c2]);
        expect(c1.parent).to.eq(null);
        expect(c2.parent).to.eq(p);
    });

    it('replaceChild - does not exist', () => {
        const p = new BaseNode({});
        const c1 = new BaseNode({});
        const c2 = new BaseNode({});
        const c3 = new BaseNode({});

        p.addChild(c1);
        expect(p.children).to.deep.eq([c1]);
        expect(c1.parent).to.eq(p);

        p.replaceChild(c2, c3);

        expect(p.children).to.deep.eq([c1]);
        expect(c1.parent).to.eq(p);
        expect(c2.parent).to.eq(null);
        expect(c3.parent).to.eq(null);
    });
});
