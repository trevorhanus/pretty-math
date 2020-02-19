export function toHex(str: string): string {
    let result = '';

    for (let i = 0; i < str.length; i++) {
        const hex = str.charCodeAt(i).toString(16);
        result += ('000' + hex).slice(-4);
    }

    return result
}

export function fromHex(hex: string): string {
    var hexes = hex.match(/.{1,4}/g) || [];

    let str = '';
    for(let i = 0; i < hexes.length; i++) {
        str += String.fromCharCode(parseInt(hexes[i], 16));
    }

    return str;
}
