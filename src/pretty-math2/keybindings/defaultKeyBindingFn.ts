import React from 'react';
import { hasTripleModifier } from 'pretty-math2/utils/KeyUtils';

export function defaultKeyBindingFn(e: React.KeyboardEvent): string {
    if (e.defaultPrevented) {
        return;
    }

    if (hasTripleModifier(e)) {
        switch (e.keyCode) {

            case 67: // C
                return 'log_calchub';

            case 76: // L
                return 'log_state';

            case 83: // S
                return 'log_selection';

            default:
                // fall through

        }
    }

    if (e.shiftKey) {
        switch (e.keyCode) {

            case 37: // ArrowLeft
                return 'move_selection';

            case 38: // ArrowUp
                return 'move_selection';

            case 39: // ArrowRight
                return 'move_selection';

            case 40: // ArrowDown
                return 'move_selection';

            default:
                // fall through to non-shift bindings
        }
    }

    switch (e.keyCode) {

        case 8: // Backspace
            return 'delete';

        case 13: // Enter
            return 'enter-pressed';

        case 27: // Escape
            return 'blur';

        case 37: // ArrowLeft
            return 'move_cursor';

        case 38: // ArrowUp
            return 'move_cursor';

        case 39: // ArrowRight
            return 'move_cursor';

        case 40: // ArrowDown
            return 'move_cursor';

        case 220: // backslash
            return 'force_assistant_open';

        default:
            return null;
    }
}
