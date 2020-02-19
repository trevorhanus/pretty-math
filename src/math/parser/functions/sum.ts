import { add, INode } from '../../internal';

export function sum(args: INode[]): INode {
    if (!args || args.length === 0) {
        throw new SyntaxError('Invalid arguments for sum.');
    }

    return args.reduce((prev, cur) => {
        return add([prev, cur]);
    });
}
