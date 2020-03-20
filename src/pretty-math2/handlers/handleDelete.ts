import { EditorState } from 'pretty-math2/model/EditorState';

export function handleDelete(editorState: EditorState, e: React.KeyboardEvent) {
    editorState.remove();
}
