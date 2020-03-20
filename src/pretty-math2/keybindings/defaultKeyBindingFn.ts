import React from 'react';

export function defaultKeyBindingFn(e: React.KeyboardEvent): string {
    if (e.keyCode === 8) return 'delete';
    if (e.keyCode === 13) return 'enter-pressed';
    if (e.shiftKey && 37 <= e.keyCode && e.keyCode <= 40) return 'move_selection';
    if (37 <= e.keyCode && e.keyCode <= 40) return 'cursor-move';
    return null;
}
