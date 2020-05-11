import { Editor } from 'pretty-math2/model/Editor';
import { Dir } from '../interfaces';
import { hasCommandModifier } from '../utils/KeyUtils';

export function handleDelete(editor: Editor, e: React.KeyboardEvent) {
    if (hasCommandModifier(e)) {
        editor.moveSelectionFocusToFringe(Dir.Left);
    }

    editor.removeNext();
}
