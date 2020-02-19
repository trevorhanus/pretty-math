import { IBlock, IBlockDecor, IDecorator, UnitsBlockDecor } from 'pretty-math/internal';

export class UnitsDecorator implements IDecorator {

    getDecorForBlock(block: IBlock): IBlockDecor {
        return new UnitsBlockDecor(block);
    }
}
