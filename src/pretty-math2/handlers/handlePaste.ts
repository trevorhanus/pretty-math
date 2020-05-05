import { BlockFactory } from 'pretty-math2/blocks/BlockFactory';
import { EditorState } from 'pretty-math2/model/EditorState';

export function handlePaste(editorState: EditorState, e: React.ClipboardEvent) {
    const data = e.clipboardData.getData('text/prettyMath');
    if (data) {
        const obj = JSON.parse(data);
        if (obj.prettyMath.length > 0) {
            if (!editorState.selection.isCollapsed) {
                editorState.remove();
            }
            for (let i = 0; i < obj.prettyMath.length; i++) {
                const block = BlockFactory.createBlockFromState(obj.prettyMath[i]);
                editorState.insertBlock(block);
            }
        }
    }
}