import React from 'react';
import { BlockFactory } from '../blocks/BlockFactory';
import { Editor } from '../model/Editor';

export function handleTextareaChange(editorState: Editor, e: React.ChangeEvent<HTMLTextAreaElement>) {
    // Still a work in progress. Looking into other ways to find the keys we want
    const keyValue = e.target.value;

    const { focus } = editorState.selection;
    if (focus.parent.type === 'math:derivative' && focus.list.name === 'wrt') {
        if (keyValue === 'd') {
            const newBlock = BlockFactory.createBlock('math:differential', { displayValue: '∂' });
            editorState.insertBlock(newBlock);
            editorState.selection.anchorAt(newBlock.childMap.inner.start);
            return;
        }
        return;
    }
    if (keyValue === 's') {
        const newBlock = BlockFactory.createBlock('math:function', { displayValue: 'sin' });
        editorState.insertBlock(newBlock);
        return;
    }
    if (keyValue === 'r') {
        const newBlock = BlockFactory.createBlock('math:squareRoot');
        editorState.insertBlock(newBlock);
        editorState.selection.anchorAt(newBlock.childMap.inner.start);
        return;
    }
    if (keyValue === 'v') {
        const newBlock = BlockFactory.createBlock('math:derivative');
        newBlock.childMap.wrt.insertBlock(newBlock.childMap.wrt.start, BlockFactory.createBlock('math:differential', { displayValue: '∂' }));
        editorState.insertBlock(newBlock);
        editorState.selection.anchorAt(newBlock.childMap.wrt.start);
        return;
    }
    if (keyValue === 'i') {
        handleIntegral(editorState);
        return;
    }
    // Fraction
    if (keyValue === '/') {
        handleFraction(editorState);
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
    if (keyValue === ')') {
        const newBlock = BlockFactory.createBlock('math:right_paren');
        editorState.insertBlock(newBlock);
        return;
    }
    if (keyValue === '(') {
        const newBlock = BlockFactory.createBlock('math:left_paren');
        editorState.insertBlock(newBlock);
        return;
    }

    const newBlock = BlockFactory.createBlock('atomic', { text: keyValue });
    editorState.insertBlock(newBlock);
}

function handleFraction(editorState: Editor) {
    const newBlock = BlockFactory.createBlock('math:fraction');
    editorState.insertBlock(newBlock);
    editorState.selection.anchorAt(newBlock.childMap['num'].start);
}

function handleIntegral(editorState: Editor) {
    const newBlock = BlockFactory.createBlock('math:integral');
    newBlock.childMap.rightBound.addEndBlock();
    newBlock.childMap.leftBound.addEndBlock();
    editorState.insertBlock(newBlock);
    editorState.selection.anchorAt(newBlock.childMap.rightBound.start);
}

function handleSubscript(editorState: Editor) {
    const { focus } = editorState.selection;
    const { prev } = focus;
    if (prev && prev.type === 'math:supsub') {
        if (prev.childMap.sub.isNull) {
            prev.childMap.sub.addEndBlock();
        }
        editorState.selection.anchorAt(prev.childMap.sub.end);
        return;
    }
    if (focus.type === 'math:supsub') {
        if (focus.childMap.sub.isNull) {
            focus.childMap.sub.addEndBlock();
        }
        editorState.selection.anchorAt(focus.childMap.sub.start);
        return;
    }
    const newBlock = BlockFactory.createBlock('math:supsub');
    newBlock.childMap.sub.addEndBlock();
    editorState.insertBlock(newBlock);
    editorState.selection.anchorAt(newBlock.childMap.sub.start);
}

function handleSuperscript(editorState: Editor) {
    const { focus } = editorState.selection;
    const { prev } = focus;
    if (prev && prev.type === 'math:supsub') {
        if (prev.childMap.sup.isNull) {
            prev.childMap.sup.addEndBlock();
        }
        editorState.selection.anchorAt(prev.childMap.sup.end);
        return;
    }
    if (focus.type === 'math:supsub') {
        if (focus.childMap.sup.isNull) {
            focus.childMap.sup.addEndBlock();
        }
        editorState.selection.anchorAt(focus.childMap.sup.start);
        return;
    }
    const newBlock = BlockFactory.createBlock('math:supsub');
    newBlock.childMap.sup.addEndBlock();
    editorState.insertBlock(newBlock);
    editorState.selection.anchorAt(newBlock.childMap.sup.start);
}
