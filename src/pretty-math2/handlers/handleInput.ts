import React from 'react';
import { createBlock } from '../blocks/blocks';
import { EditorState } from '../model/EditorState';
import { CursorPosition } from '../selection/CursorPosition';

export function handleInput(editorState: EditorState, e: React.KeyboardEvent) {
    const keyValue = e.key;
    const newBlock = createBlock('text:block', { data: { text: keyValue } });
    editorState.selection.focus.block.list.blocks.push(newBlock);
    editorState.selection.anchorAt(new CursorPosition(newBlock, 1));


    // if (keyValue === '/') {
    //     // do logic to pull out numerator
    //     const range = findNumeratorRange(editorState);
    //     const numeratorList = editorState.removeRange(range);
    //     newBlock = createBlock('math:fraction');
    //     newBlock.children.num.replaceList(numeratorList);
    //     newBlock.children.anthgs.replaceList();
    // }
    //
    // editorState.insertBlock(newBlock);
}
