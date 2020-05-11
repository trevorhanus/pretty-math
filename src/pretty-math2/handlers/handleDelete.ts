import { Editor } from 'pretty-math2/internal';

export function handleDelete(editorState: Editor, e: React.KeyboardEvent) {
    editorState.remove();
}
