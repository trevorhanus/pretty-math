import { Editor, hasCommandModifier, Dir } from 'pretty-math2/internal';

export function handleDelete(editor: Editor, e: React.KeyboardEvent) {
    if (hasCommandModifier(e)) {
        editor.moveSelectionFocusToFringe(Dir.Left);
    }

    editor.removeNext();
}
