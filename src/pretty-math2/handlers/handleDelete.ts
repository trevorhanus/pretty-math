import { Editor } from 'pretty-math2/model/Editor';

export function handleDelete(editorState: Editor, e: React.KeyboardEvent) {
    editorState.remove();
}
