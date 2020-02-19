import { buildNode, INode, Token, TokenName } from '../../internal';

export function placeEqualsOnTopOfTree(tree: INode): INode {
    const assignToken = new Token(TokenName.Assign, '=');
    const missingToken = new Token(TokenName.Missing, '');
    const assignNode = buildNode(assignToken);
    const missingNode = buildNode(missingToken);

    assignNode.setChildren([missingNode, tree]);

    return assignNode;
}
