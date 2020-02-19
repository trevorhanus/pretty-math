import { action } from 'mobx';
import { MathContext } from 'math';
import { INode } from 'math';
import {
    BlockBuilder,
    BlockChainState,
    buildChainFromCalchub,
    buildChainFromTree,
    MathDecorator,
    MathFieldState,
    RootBlock
} from 'pretty-math/internal';

export interface StaticMathEngineInitOpts {
    ast?: INode;
    math?: string | MathFieldState | BlockChainState;
}

export class StaticMathEngine {
    readonly mathCxt: MathContext;
    readonly decorator: MathDecorator;
    readonly root: RootBlock;

    constructor(mathCxt: MathContext) {
        this.mathCxt = mathCxt;
        this.decorator = new MathDecorator(mathCxt);
        this.root = new RootBlock(this);
    }

    @action
    init(opts: StaticMathEngineInitOpts) {
        const { ast } = opts;
        const math = opts.math || '';

        const getChain = () => {
            if (ast) {
                return buildChainFromTree(ast);
            }

            if (typeof math === 'string' && math !== '') {
                return buildChainFromCalchub(math);
            }

            if (Array.isArray(math)) {
                return BlockBuilder.fromJS(math);
            }

            if ((math as MathFieldState).root) {
                return BlockBuilder.fromJS((math as MathFieldState).root.blocks);
            }

            return BlockBuilder.blank();
        };

        this.root.setStartBlock(getChain());
        const { text, sourceMap } = this.root.toCalchubOutput();
        this.decorator.handleChange(text, sourceMap);
    }
}
