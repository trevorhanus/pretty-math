import { Block, BlockType } from 'pretty-math/internal';

export class ExprEvaluationBlock extends Block {

    constructor(id?: string) {
        super('', null, BlockType.ExprEval, id);
    }

    clone(): ExprEvaluationBlock {
        return new ExprEvaluationBlock(this.id);
    }

}
