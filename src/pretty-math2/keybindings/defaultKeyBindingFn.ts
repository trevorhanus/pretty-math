import React from 'react';

export function defaultKeyBindingFn(e: React.KeyboardEvent): string {
    if (e.keyCode === 8) return 'delete';
    if (37 <= e.keyCode && e.keyCode <= 40) return 'cursor-move';
    return 'input';
}
