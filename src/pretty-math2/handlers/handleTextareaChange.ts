import React from 'react';
import { createBlock } from '../blocks/blocks';
import { EditorState } from '../model/EditorState';

export function handleTextareaChange(editorState: EditorState, e: React.ChangeEvent<HTMLTextAreaElement>) {
    // Still a work in progress. Looking into other ways to find the keys we want
    const keyValue = e.target.value;

    if (keyValue === 's') {
        const newBlock = createBlock('math:function', { data: { displayValue: 'sin' } });
        editorState.insertBlock(newBlock);
        return;
    }
    // Fraction
    if (keyValue === '/') {
        const newBlock = createBlock('math:fraction', {});
        editorState.insertBlock(newBlock);
        return;
    }

    const newBlock = createBlock('text:block', { data: { text: keyValue } });
    editorState.insertBlock(newBlock);
}
