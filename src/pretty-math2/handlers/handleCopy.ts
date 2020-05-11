import React from 'react';
import {
    Editor,
    rangeToPython
} from 'pretty-math2/internal';

export function handleCopy(editorState: Editor, e: React.ClipboardEvent) {
    const { start, end } = editorState.selection.range;
    const json = { prettyMath: [] };

    let cur = start;
    while (cur != end) {
        json.prettyMath.push(cur.serialize({ omitId: true }));
        cur = cur.next;
    }

    e.clipboardData.setData('text/plain', rangeToPython(editorState.selection.range));
    e.clipboardData.setData('text/prettyMath', JSON.stringify(json));
}
