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
    if (keyValue === '^') {
        handleSuperscript(editorState);
        return;
    }
    if (keyValue === '_') {
        handleSubscript(editorState);
        return;
    }

    const newBlock = createBlock('text:block', { data: { text: keyValue } });
    editorState.insertBlock(newBlock);
}


function handleSuperscript(editorState: EditorState) {
    const { focus } = editorState.selection;
    const { prev } = focus;
    if (prev && prev.type === 'math:supsub') {
        if (prev.children.sup.isEmpty) {
            prev.children.sup.addEndBlock();
        }
        editorState.selection.anchorAt(prev.children.sup.end);
        return;
    }
    if (focus.type === 'math:supsub') {
        if (focus.children.sup.isEmpty) {
            focus.children.sup.addEndBlock();
        }
        editorState.selection.anchorAt(focus.children.sup.start);
        return;
    }
    const newBlock = createBlock('math:supsub');
    newBlock.children.sup.addEndBlock();
    editorState.insertBlock(newBlock);
    editorState.selection.anchorAt(newBlock.children.sup.start);
    return;
}

function handleSubscript(editorState: EditorState) {
    const { focus } = editorState.selection;
    const { prev } = focus;
    if (prev && prev.type === 'math:supsub') {
        if (prev.children.sub.isEmpty) {
            prev.children.sub.addEndBlock();
        }
        editorState.selection.anchorAt(prev.children.sub.end);
        return;
    }
    if (focus.type === 'math:supsub') {
        if (focus.children.sub.isEmpty) {
            focus.children.sub.addEndBlock();
        }
        editorState.selection.anchorAt(focus.children.sub.start);
        return;
    }
    const newBlock = createBlock('math:supsub');
    newBlock.children.sub.addEndBlock();
    editorState.insertBlock(newBlock);
    editorState.selection.anchorAt(newBlock.children.sub.start);
    return;
}