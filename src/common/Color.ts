import { action, computed, observable } from 'mobx';
import { RGBColor } from 'react-color';

export interface IColor {
    readonly rgb: ISerialRgba;
    readonly rgbStr: string;
    readonly hex: string;
    update(props: ISerialRgba): void;
    updateFromStr(str: string): void;
}

export interface ISerialRgba {
    r?: number;
    g?: number;
    b?: number;
    a?: number;
}

export class Color implements IColor {
    @observable _r: number;
    @observable _g: number;
    @observable _b: number;
    @observable _a: number;

    constructor(props?: ISerialRgba) {
        this._r = null;
        this._g = null;
        this._b = null;
        this._a = 1;
        this.update(props || {});
    }

    @computed
    get rgb(): ISerialRgba {
        return {
            r: this._r,
            g: this._g,
            b: this._b,
            a: this._a,
        };
    }

    @computed
    get rgbStr(): string {
        if (!this.isComplete) {
            return null;
        }
        return `rgba(${[this._r, this._g, this._b, this._a].join(', ')})`;
    }

    @computed
    get hex(): string {
        if (!this.isComplete) {
            return null;
        }
        return `#${toHex(this._r)}${toHex(this._g)}${toHex(this._b)}`;
    }

    @action
    update(props: ISerialRgba = {}) {
        const { r, g, b, a } = props;
        if (r != null && !isNaN(r)) this._r = bounds(r);
        if (g != null && !isNaN(g)) this._g = bounds(g);
        if (b != null && !isNaN(b)) this._b = bounds(b);
        if (a != null && !isNaN(a)) this._a = bounds(a, 0, 1);
    }

    @action
    updateFromStr(str: string) {
        const props = convertStrToSerial(str);
        this.update(props);
    }

    private get isComplete(): boolean {
        return ![this._r, this._g, this._b].some(c => c == null);
    }

    static fromStr(str: string): Color {
        const c = new Color();
        c.updateFromStr(str);
        return c;
    }

    static create(strOrRgbOrColor: string | RGBColor | IColor): Color {
        const opts = strOrRgbOrColor;

        if (typeof opts === 'string') {
            return Color.fromStr(opts);
        }

        if ((opts as IColor).rgb != null) {
            return new Color((opts as IColor).rgb);
        }

        return new Color(opts as RGBColor);
    }
}

export function getRandomColor(): Color {
    return Color.fromStr(getRandomHexColor());
}

const possibleLetters: string = '0369CF';

export function getRandomHexColor(): string {
    const white = '#FFFFFF';

    while (true) {
        let color = '#';
        [1, 1, 1].forEach(() => {
            const letter = possibleLetters[Math.floor(Math.random() * 6)];
            color += letter + letter;
        });

        if (contrastHex(white, color) > 4.5) {
            return color;
        }
    }
}

export function contrastHex(hex1: string, hex2: string): number {
    const c1 = Color.fromStr(hex1);
    const c2 = Color.fromStr(hex2);
    return (luminanace(c1.rgb.r, c1.rgb.g, c1.rgb.b)) / (luminanace(c2.rgb.r, c2.rgb.g, c2.rgb.b));
}

export function luminanace(r: number, g: number, b: number): number {
    const a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function bounds(val: number, low: number = 0, high: number = 255): number {
    if ( val < low ) return low;
    if ( val > high ) return high;
    return val;
}

function toHex(num: number): string {
    return ('0' + Math.round(num).toString(16)).slice(-2);
}

function convertStrToSerial(str: string): ISerialRgba {
    const trimmed = str.trim();

    const rgbaMatches = trimmed.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?))?\s*\)$/);
    if (rgbaMatches != null) {
        const [ input, r, g, b, a ] = rgbaMatches;
        return {
            r: parseInt(r, 10),
            g: parseInt(g, 10),
            b: parseInt(b, 10),
            a: parseFloat(a),
        };
    }

    const hexMatches = trimmed.toLowerCase().match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})|([0-9a-f])([0-9a-f])([0-9a-f])$/);
    if (hexMatches != null) {
        const [ fullMatch, red, green, blue, r, g, b ] = hexMatches;
        if (fullMatch.length === 3) {
            // short codes
            return {
                r: parseInt(r + r, 16),
                g: parseInt(g + g, 16),
                b: parseInt(b + b, 16),
            };
        } else {
            // long form
            return {
                r: parseInt(red, 16),
                g: parseInt(green, 16),
                b: parseInt(blue, 16),
            };
        }
    }
}
