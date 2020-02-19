import { expect } from 'chai';
import { calchubFromChain, IBlock } from 'pretty-math/internal';

export function chainEquals(chain: IBlock, shorthand: any[]) {
    const actualShorthand = chain.toShorthand();
    expect(actualShorthand.length, `${calchubFromChain(chain)}: same number of top level blocks`).to.eq(shorthand.length);
    actualShorthand.forEach((s, i) => {
        expect(s).to.deep.include(shorthand[i]);
    });
}
