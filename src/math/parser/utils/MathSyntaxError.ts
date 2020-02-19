export class MathSyntaxError extends Error {
    start: number;
    end: number;

    constructor(m: string, start?: number, end?: number) {
        super(m);
        Object.setPrototypeOf(this, MathSyntaxError.prototype);
        this.start = start;
        this.end = end;
    }
}
