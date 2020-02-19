import { action, computed } from 'mobx';
import { omitNulls } from 'math';
import {
    Block,
    BlockBuilder,
    BlockChain,
    BlockChainOpts,
    BlockType,
    CursorOrder,
    CursorOrderOpts,
    Dir,
    getNextCursorPositionOutOf,
    IBlock,
    IBlockState,
    ICompositeBlock,
    ICursorPosition,
    isBlankBlock,
} from 'pretty-math/internal';

export interface BlockChildrenOpts {
    [name: string]: BlockChainOpts;
}

export interface CompositeBlockOpts {
    type: BlockType,
    children: BlockChildrenOpts;
    cursorOrder: CursorOrderOpts;
    entries: {
        fromLeft: {
            up?: string;
            right?: string;
            down?: string;
        },
        fromRight: {
            up?: string;
            left?: string;
            down?: string;
        }
    }
}

export class CompositeBlock extends Block implements ICompositeBlock {
    readonly chainMap: Map<string, BlockChain>;
    readonly cursorOrder: CursorOrder;
    readonly opts: CompositeBlockOpts;

    constructor(opts: CompositeBlockOpts, text: string, latex: string, id?: string) {
        super(text, latex, opts.type, id);
        this.chainMap = new Map<string, BlockChain>();
        this.opts = opts;
        this.cursorOrder = new CursorOrder(opts.cursorOrder);

        for (let name in opts.children) {
            const chain = new BlockChain(this, opts.children[name]);
            this.chainMap.set(name, chain);
        }
    }

    get chains(): BlockChain[] {
        return Array.from(this.chainMap.values());
    }

    @computed
    get children(): IBlock[] {
        return this.chains.reduce((blocks, chain) => {
            chain.chainStart && blocks.push(chain.chainStart);
            return blocks;
        }, []);
    }

    get isComposite(): true {
        return true;
    }

    clone(): CompositeBlock {
        return new CompositeBlock(this.opts, this.text, this._latex);
    }

    contains(block: IBlock): boolean {
        return super.contains(block) || this.chains.some(chain => chain.contains(block));
    }

    getBlockById(id: string): IBlock {
        let block = super.getBlockById(id);
        let i = 0;

        while (i < this.chains.length && block == null) {
            const chain = this.chains[i];
            block = chain.getBlockById(id);
            i++;
        }

        return block;
    }

    getChainByBlock(block: IBlock): BlockChain {
        return this.chains.find(chain => chain.contains(block));
    }

    getChainAtChainPosition(chainPosition: number): BlockChain {
        return this.chains.find(chain => chain.chainNumber === chainPosition);
    }

    getChain(name: string): BlockChain {
        return this.chainMap.get(name);
    }

    getEntryBlock(from: number, dir: Dir): IBlock {
        const child = this.getNonNullEntryChild(from, dir);
        return child && child.chainStart;
    }

    getEntryChain(fromOffset: number, dir: Dir): BlockChain {
        const fromKey = fromOffset === 0 ? 'fromLeft' : 'fromRight';
        const map = {
            [Dir.Up]: 'up',
            [Dir.Right]: 'right',
            [Dir.Down]: 'down',
            [Dir.Left]: 'left',
        };

        const childName = this.opts.entries[fromKey][map[dir]];
        return this.getChain(childName);
    }

    getNonNullEntryChild(fromOffset: number, dir: Dir): BlockChain {
        let chain = this.getEntryChain(fromOffset, dir);

        while (chain && chain.chainStart == null) {
            chain = this.getNextNonNullChain(chain, dir);
        }

        return chain;
    }

    getNextChain(from: BlockChain, dir: Dir): BlockChain {
        const nextName = this.cursorOrder.getNextChainName(from.name, dir);
        return this.getChain(nextName);
    }

    getNextChild(child: IBlock, dir: Dir): IBlock {
        const chain = this.getChainByBlock(child);

        if (!chain) {
            return null;
        }

        const next = this.getNextNonNullChain(chain, dir);

        if (dir === Dir.Left) {
            return next && next.chainStart.chainEnd;
        }

        return next && next.chainStart;
    }

    getNextNonNullChain(from: BlockChain, dir: Dir): BlockChain {
        let nextChild = this.getNextChain(from, dir);

        while (nextChild != null && nextChild.chainStart == null) {
            nextChild = this.getNextChain(nextChild, dir);
        }

        return nextChild;
    }

    isInside(block: IBlock): boolean {
        return this.children.some(child => child.contains(block));
    }

    isInsideInclusive(block: IBlock): boolean {
        return this === block || this.isInside(block);
    }

    @action
    removeChild(block: IBlock): ICursorPosition {
        const chain = this.getChainByBlock(block);
        const b = chain.replaceChain(block);
        return { block: b, offset: 0 };
    }

    @action
    removeNextOutOfChild(dir: Dir, child: IBlock): ICursorPosition {
        if (isBlankBlock(child)) {
            return this.removeChild(child);
        }
        return getNextCursorPositionOutOf(child, dir);
    }

    @action
    replaceChain(name: string, newStart: IBlock) {
        const chain = this.getChain(name);
        chain && chain.replaceChain(newStart);
    }

    @action
    replaceChild(oldChild: IBlock, newChild: IBlock) {
        const chain = this.getChainByBlock(oldChild);
        chain.replaceChain(newChild);
    }

    toJSShallow(): IBlockState {
        return {
            ...super.toJSShallow(),
            ...this.chains.reduce((js, chain) => {
                if (!chain.isNull) {
                    js[chain.name] = chain.chainStart.toJS();
                }
                return js;
            }, {}),
        }
    }

    toShorthand(): any[] {
        let shorthand = {
            type: this.type,
            latex: this._latex,
            text: this._text,
        };

        this.chains.forEach(chain => {
            shorthand[chain.name] = chain.toShorthand();
        });

        shorthand = omitNulls(shorthand);

        if (this.right) {
            return [shorthand].concat(this.right.toShorthand());
        } else {
            return [shorthand];
        }
    }

    @action
    initFromJS(js: IBlockState) {
        this.chains.forEach(child => {
            const state = js[child.name];
            if (state) {
                child.replaceChain(BlockBuilder.fromJS(state));
            }
        });
    }
}
