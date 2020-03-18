import React from 'react';
import { createBlock } from '../blocks/blocks';
import { EditorState } from '../model/EditorState';

export function handleInput(editorState: EditorState, e: React.KeyboardEvent) {
    // Still a work in progress. Looking into other ways to find the keys we want
    const keyValue = e.key;
    if (keyValue.length > 1) return;

    // Fraction
    // 

    const newBlock = createBlock('text:block', { data: { text: keyValue } });
    editorState.insertBlock(newBlock);
}
