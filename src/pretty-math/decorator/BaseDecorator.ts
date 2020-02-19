import { IBlock, IBlockDecor, IDecorator } from 'pretty-math/internal';

export class BaseDecorator implements IDecorator {

    constructor() {}

    getDecorForBlock(block: IBlock): IBlockDecor {
        return null;
    }

}
