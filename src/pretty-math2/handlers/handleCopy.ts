import React from 'react';
import { EditorState } from 'pretty-math2/model/EditorState';
import { rangeToPython } from 'pretty-math2/utils/RangeUtils';

export function handleCopy(editorState: EditorState, e: React.ClipboardEvent) {
    const { start, end } = editorState.selection.range;
    const json = { prettyMath: [] }
    
    let cur = start;
    while (cur != end) {
        json.prettyMath.push(cur.serialize({ omitId: true }));
        cur = cur.next;
    }
    
    e.clipboardData.setData('text/plain', rangeToPython(editorState.selection.range));
    e.clipboardData.setData('text/prettyMath', JSON.stringify(json));
}