import { BlockBuilder, BlockType, calchubOutputFromChain, FunctionBlock, IBlockState } from 'pretty-math/internal';
import { Output } from 'pretty-math/utils';

export class RadicalBlock extends FunctionBlock {

    constructor(id?: string) {
        super('sqrt', '\\sqrt', BlockType.Radical, id);
    }

    clone(): RadicalBlock {
        let rad = new RadicalBlock();
        if (this.inner != null) {
            rad.setInner(this.inner.cloneDeep());
        }
        return rad;
    }

    toCalchubOutput(): Output {
        return Output.fromMany([
            { text: '\\sqrt', source: this },
            { text: '{', source: this },
            calchubOutputFromChain(this.inner),
            { text: '}', source: this },
        ]);
    }

    static fromJS(props: IBlockState): RadicalBlock {
        const b = new RadicalBlock(props.id);
        const innerState = props.inner;
        if (innerState) {
            b.setInner(BlockBuilder.fromJS(innerState));
        }
        return b;
    }
}
