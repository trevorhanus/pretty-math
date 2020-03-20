import React from 'react';
import { createBlock } from '../blocks/blocks';
import { EditorState } from '../model/EditorState';

export function handleTextareaChange(editorState: EditorState, e: React.ChangeEvent<HTMLTextAreaElement>) {
    // Still a work in progress. Looking into other ways to find the keys we want
    const keyValue = e.target.value;

    if (keyValue === 's') {
        const newBlock = createBlock('function:block', { data: { displayValue: 'sin' } });
        editorState.insertBlock(newBlock);
        return;
    }
    // Fraction
    if (keyValue === 'f') {
        const newBlock = createBlock('fraction:block', {});
        editorState.insertBlock(newBlock);
        return;
    }

    const newBlock = createBlock('text:block', { data: { text: keyValue } });
    editorState.insertBlock(newBlock);
}
