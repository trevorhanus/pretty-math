import { action, computed, observable } from 'mobx';
import {
    BlankBlock,
    BlockBuilder,
    BlockType,
    calchubOutputFromChain,
    FunctionBlock,
    IBlock,
    IBlockState,
    ICompositeBlock
} from 'pretty-math/internal';
import { Output } from 'pretty-math/utils';

export class DefineFunctionBlock extends FunctionBlock implements ICompositeBlock {
    @observable.ref private _funcName: IBlock;

    constructor(id?: string) {
        super(null, '\\dfunc', BlockType.DefineFunction, id);
        this.setFuncName(new BlankBlock());
    }

    @computed
    get funcName(): IBlock {
        return this._funcName;
    }

    @action
    setFuncName(block: IBlock) {
        if (block == null) {
            return;
        }

        const start = block.chainStart;
        start.setParent(this, null);
        this._funcName = start;
    }

    toCalchubOutput(): Output {
        return Output.fromMany([
            { text: '\\dfunc{', source: this },
            calchubOutputFromChain(this.funcName),
            { text: ',', source: this },
            calchubOutputFromChain(this.inner),
            { text: '}', source: this },
        ]);
    }

    toJSShallow(): IBlockState {
        return {
            ...super.toJSShallow(),
            funcName: this.funcName.toJS(),
        }
    }

    toShorthand(): any[] {
        const shorthand = {
            type: this.type,
            latex: this._latex,
            inner: this.inner.toShorthand(),
            funcName: this.funcName.toShorthand(),
        };

        if (this.right) {
            return [shorthand].concat(this.right.toShorthand());
        } else {
            return [shorthand];
        }
    }

    static fromJS(js: IBlockState): DefineFunctionBlock {
        const { id, funcName, inner, type } = js;

        if (type !== BlockType.DefineFunction) {
            throw new Error(`invalid state for a UserDefinedFunctionBlock. type is not ${BlockType.DefineFunction}`);
        }

        const udf = new DefineFunctionBlock(id);

        if (funcName) {
            udf.setFuncName(BlockBuilder.fromJS(funcName));
        }

        if (inner) {
            udf.setInner(BlockBuilder.fromJS(inner));
        }

        return udf;
    }
}
