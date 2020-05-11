import { BlockFactory } from 'pretty-math2/blocks/BlockFactory';
import { Editor } from 'pretty-math2/model/Editor';
import * as React from 'react';

export function handlePaste(editor: Editor, e: React.ClipboardEvent) {
    const data = e.clipboardData.getData('text/prettyMath');
    if (data) {
        const obj = JSON.parse(data);
        if (obj.prettyMath.length > 0) {
            if (!editor.selection.isCollapsed) {
                editor.remove();
            }
            for (let i = 0; i < obj.prettyMath.length; i++) {
                const block = BlockFactory.createBlockFromState(obj.prettyMath[i]);
                editor.insertBlock(block);
            }
        }
    }
}
