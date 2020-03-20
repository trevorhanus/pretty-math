import { UserAgent } from 'common';

const isOSX = UserAgent.isPlatform('Mac OS X');

export function isCtrlKeyCommand(e: React.KeyboardEvent): boolean {
    return !!e.ctrlKey && !e.altKey;
}

export function hasCommandModifier(e: React.KeyboardEvent): boolean {
    return isOSX
        ? !!e.metaKey && !e.altKey
        : isCtrlKeyCommand(e);
}
