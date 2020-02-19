export function copyToClipboard(str: string) {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

let svg: SVGSVGElement;

export function createSVGPoint(x: number, y: number): SVGPoint {
    if (svg == null) svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const pt = svg.createSVGPoint();
    pt.x = x;
    pt.y = y;
    return pt;
}

export function createSVGMatrix(m: number[]): SVGMatrix {
    if (svg == null) svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const matrix = svg.createSVGMatrix();
    matrix.a = m[0];
    matrix.b = m[1];
    matrix.c = m[4];
    matrix.d = m[5];
    matrix.e = m[12];
    matrix.f = m[13];
    return matrix;
}

export function haveWindow(): boolean {
    return typeof window !== 'undefined';
}

export const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

export const isNode = typeof process !== 'undefined'
    && process.versions != null
    && process.versions.node != null;

export type Position = 'top-left' | 'top-center' | 'top-right' | 'center-right' | 'bottom-right' | 'bottom-center' | 'bottom-left' | 'center-left';

export function getPosition(target: HTMLElement, pos: Position): { top: number, left: number } {
    const { top, left, right, bottom } = target.getBoundingClientRect();
    const cx = left + ((right - left) / 2);
    const cy = top + ((bottom - top) / 2);

    const [ vert, hor ] = pos.split('-');

    const vertOpts = {
        'top': top,
        'center': cy,
        'bottom': bottom,
    };

    const horOpts = {
        'left': left,
        'center': cx,
        'right': right,
    };

    return {
        left: horOpts[hor] || left,
        top: vertOpts[vert] || top
    };
}
