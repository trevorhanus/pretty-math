import { Dir } from 'pretty-math/internal';

export interface CursorOrderOpts {
    leftToRight: string[];
    rightToLeft?: string[];
    upToDown: string[];
    downToUp?: string[];
}

export class CursorOrder {
    leftToRight: string[];
    rightToLeft: string[];
    upToDown: string[];
    downToUp: string[];

    constructor(opts: CursorOrderOpts) {
        this.leftToRight = opts.leftToRight;
        this.rightToLeft = opts.rightToLeft || opts.leftToRight.slice().reverse();
        this.upToDown = opts.upToDown;
        this.downToUp = opts.downToUp || opts.upToDown.slice().reverse();
    }

    getOrderInDir(dir: Dir): string[] {
        switch (dir) {
            case Dir.Up:
                return this.downToUp;
            case Dir.Right:
                return this.leftToRight;
            case Dir.Down:
                return this.upToDown;
            case Dir.Left:
                return this.rightToLeft;
        }
    }

    getNextChainName(name: string, dir: Dir): string {
        const order = this.getOrderInDir(dir);
        // find the cur index
        const curIndex = order.indexOf(name);

        if (curIndex < -1) {
            return null;
        }

        return order[curIndex + 1];
    }
}
