import React from 'react';
import { extractFractionNumerator, parseCalchub } from 'math';
import {
    BlockFactory,
    Editor,
    rangeToCalchub,
    blocksFromNodeTree,
    isType,
} from 'pretty-math2/internal';
import { BlockRange } from 'pretty-math2/selection/BlockRange';

export function handleTextareaChange(editorState: Editor, e: React.ChangeEvent<HTMLTextAreaElement>) {
    // Still a work in progress. Looking into other ways to find the keys we want
    const keyValue = e.target.value;

    const { focus } = editorState.selection;

    if (keyValue === 'd' && isType(focus.parent, 'math:derivative') && focus.list.name === 'wrt') {
        const newBlock = BlockFactory.createBlock('math:differential', { displayValue: 'd' });
        editorState.insertBlock(newBlock);
        editorState.selection.anchorAt(newBlock.childMap.inner.start);
        return;
    }

    // if (keyValue === 'i') {
    //     handleIntegral(editorState);
    //     return;
    // }

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
        const newBlock = BlockFactory.createBlock('math:rightParen');
        editorState.insertBlock(newBlock);
        return;
    }

    if (keyValue === '(') {
        const newBlock = BlockFactory.createBlock('math:leftParen');
        editorState.insertBlock(newBlock);
        return;
    }

    const newBlock = BlockFactory.createBlock('atomic', { text: keyValue });
    editorState.insertBlock(newBlock);
}

function handleFraction(editor: Editor) {
    const { focus } = editor.selection;
    const sr = new BlockRange();
    sr.setAnchor(focus);
    sr.setFocus(focus.list.start);
    const node = extractFractionNumerator(parseCalchub(rangeToCalchub(sr)).root);
    const numBlocks = blocksFromNodeTree(node)
    const newBlock = BlockFactory.createBlock('math:fraction');
    if (numBlocks.length > 0) {
        numBlocks.forEach(block => editor.removeNext());
        newBlock.childMap.num.addBlocks(...numBlocks);
        editor.insertBlock(newBlock);
        editor.selection.anchorAt(newBlock.childMap['denom'].start);
    } else {
        editor.insertBlock(newBlock);
        editor.selection.anchorAt(newBlock.childMap['num'].start);
    }
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
