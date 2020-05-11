import { INode, verifyArgs } from '../../internal';

export function parens(args: INode[]): INode {
    args = verifyArgs(1, 'parens', args);
    return args[0];
}