const chars = [...'abcdefghijklmnopqrstuvwxyz'];
const symToSafe: { [symbol: string]: string } = {};
const safeToSym: { [pythonSafe: string]: string } = {};

export function getPythonSafeSymbol(symbol: string): string {
    let sym = symToSafe[symbol];

    if (sym) {
        return sym;
    }

    while (sym == null || safeToSym.hasOwnProperty(sym)) {
        sym = 'v' + [...Array(3)].map(i => chars[Math.random() * chars.length | 0]).join('');
    }

    safeToSym[sym] = symbol;
    symToSafe[symbol] = sym;
    return sym;
}

export function getSymbolForPythonSafeSymbol(pythonSafe: string): string {
    return safeToSym[pythonSafe] || pythonSafe;
}
