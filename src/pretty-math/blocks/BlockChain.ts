import { action, computed, observable } from 'mobx';
import { BlankBlock, IBlock, ICompositeBlock, isBlankBlock } from 'pretty-math/internal';

export interface BlockChainOpts {
    chainNumber: number;
    canBeNull: boolean;
    startNull?: boolean;
    name: string;
}

export class BlockChain {
    @observable.ref private _start: IBlock;
    readonly canBeNull: boolean;
    readonly chainNumber: number;
    readonly name: string;
    readonly opts: BlockChainOpts;
    readonly parent: ICompositeBlock;

    constructor(parent: ICompositeBlock, opts: BlockChainOpts,) {
        this.canBeNull = opts.canBeNull != null ? opts.canBeNull : true;
        this.chainNumber = opts.chainNumber;
        this.name = opts.name;
        this.opts = opts;
        this.parent = parent;
        this._start = null;
        if (!this.opts.canBeNull || (this.opts.startNull != null && !this.opts.startNull)) {
            this.replaceChain(new BlankBlock());
        }
    }

    @computed
    get chainEnd(): IBlock {
        return this._start && this._start.chainEnd;
    }

    @computed
    get chainStart(): IBlock {
        return this._start;
    }

    @computed
    get isEmpty(): boolean {
        return this._start == null || isBlankBlock(this._start);
    }

    @computed
    get isNull(): boolean {
        return this._start == null;
    }

    contains(block: IBlock): boolean {
        return this._start && this._start.contains(block);
    }

    containsSurfaceLevel(block: IBlock): boolean {
        return this.some(b => b === block);
    }

    find(predicate: (block: IBlock) => IBlock): IBlock {
        let block = this._start;
        while (block != null) {
            const result = predicate(block);
            if (result) {
                return block;
            }
            block = block.right;
        }
        return null;
    }

    getBlockById(id: string): IBlock {
        return this.find(block => block.getBlockById(id));
    }

    reduce<T>(cb: (previous: T, current: IBlock) => T, initial: T): T {
        let aggregate = initial;
        let block = this._start;
        while (block != null) {
            aggregate = cb(aggregate, block);
            block = block.right;
        }
        return aggregate;
    }

    @action
    removeFromTree() {
        this._start.setParent(null, null);
    }

    @action
    replaceChain(block: IBlock): IBlock {
        if (this._start) {
            this._start.setParent(null, null);
            this._start = null;
        }

        if (!block && !this.canBeNull) {
            block = new BlankBlock();
        }

        if (block) {
            block.setParent(this.parent, this.chainNumber);
        }

        this._start = block;
        return block;
    }

    some(iterator: (block: IBlock) => boolean): boolean {
        let block = this._start;
        while (block != null) {
            const result = iterator(block);
            if (result === true) {
                return true;
            }
            block = block.right;
        }
        return false;
    }

    toShorthand(): any[] {
        if (!this._start) {
            return null;
        }
        return this._start.toShorthand();
    }
}
