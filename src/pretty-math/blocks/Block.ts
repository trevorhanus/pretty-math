import { generateId, omitNulls } from 'common';
import { INode, MathContext } from 'math';
import { action, computed, observable } from 'mobx';
import {
    BlockChainState,
    BlockType,
    Dir,
    EngineWithDecorator,
    IBlock,
    IBlockDecor,
    IBlockState,
    ICompositeBlock,
    ICursorPosition,
    invariant,
    MathBlockDecor,
    normalizeOffset,
} from 'pretty-math/internal';
import { BlockPosition, Output } from 'pretty-math/utils';

export class Block implements IBlock {
    readonly id: string;
    readonly type: BlockType;
    ref: HTMLElement;
    protected _text: string;
    protected _latex: string;
    protected _mathCxt: MathContext;
    @observable private _chainNumber: number;
    @observable.ref protected _engine: EngineWithDecorator;
    @observable.ref private _left: IBlock;
    @observable.ref protected _parent: ICompositeBlock;
    @observable.ref private _right: IBlock;

    constructor(text: string, latex?: string, type: BlockType = BlockType.Block, id?: string) {
        this.id = id || generateId();
        this.type = type;
        this._text = text;
        this._latex = latex;
    }

    @computed
    get chainEnd(): IBlock {
        return this._right ? this._right.chainEnd : this;
    }

    @computed
    get chainLength(): number {
        return this.right != null ? this.right.chainLength + 1 : 1;
    }

    @computed
    get chainNumber(): number {
        return this.isChainStart ? this._chainNumber : this.chainStart.chainNumber;
    }

    @computed
    get chainStart(): IBlock {
        return this.left ? this._left.chainStart : this;
    }

    @computed
    get decor(): IBlockDecor {
        return this.engine
            ? this.engine.decorator.getDecorForBlock(this)
            : new MathBlockDecor(null, this, this.mathCxt);
    }

    @computed
    get depth(): number {
        return this.parent == null ? 1 : this.parent.depth + 1;
    }

    @computed
    get engine(): EngineWithDecorator {
        return this.isRoot ? this._engine : this.root.engine;
    }

    @computed
    get position(): BlockPosition {
        if (this.isRoot) {
            return BlockPosition.root();
        }

        if (this._left) {
            return this._left.position.incIndex();
        }

        if (this._parent) {
            // chainStart
            return this._parent.position.incLevel(this._chainNumber);
        }

        throw new Error('Unexpected condition.');
    }

    @computed
    get isChainEnd(): boolean {
        return this._right == null;
    }

    @computed
    get isChainStart(): boolean {
        return this._left == null;
    }

    get isComposite(): boolean {
        return false;
    }

    @computed
    get isRoot(): boolean {
        return this._left == null && this._parent == null;
    }

    @computed
    get left(): IBlock {
        return this._left;
    }

    get mathCxt(): MathContext {
        return this.isRoot ? this._mathCxt : this.root.mathCxt;
    }

    @computed
    get node(): INode {
        return this.decor && this.decor.node;
    }

    @computed
    get parent(): ICompositeBlock {
        // parent always comes from the start block
        return this.isChainStart ? this._parent : this._left.parent;
    }

    @computed
    get prev(): IBlock {
        return this.left || this.parent || null;
    }

    @computed
    get right(): IBlock {
        return this._right;
    }

    @computed
    get root(): IBlock {
        if (this.isRoot) {
            return this;
        }

        if (this._left != null) {
            return this._left.root;
        }

        if (this._parent != null) {
            return this._parent.root;
        }

        return null;
    }

    get text(): string {
        return this._text != null ? this._text : '';
    }

    contains(block: IBlock): boolean {
        return this === block || (this.right != null && this.right.contains(block));
    }

    containsShallow(block: IBlock): boolean {
        return this === block || (this.right != null && this.right.containsShallow(block));
    }

    forEachBlock(iterator: (block: IBlock) => void) {
        iterator(this);
        this.right && this.right.forEachBlock(iterator);
    }

    getBlockById(id: string): IBlock {
        if (this.id === id) {
            return this;
        } else if (this.right != null) {
            return this.right.getBlockById(id);
        } else {
            return null;
        }
    }

    getCursorPositionAt(offset: number): ICursorPosition {
        offset = normalizeOffset(offset);
        return {
            block: this,
            offset,
        };
    }

    @action
    insertAt(blockChain: IBlock, offset: number): ICursorPosition {
        if (blockChain == null) {
            return;
        }

        offset = normalizeOffset(offset);

        if (offset === 0) {
            this.insertChainLeft(blockChain);
            return { block: this, offset: 0 };
        }

        if (offset === 1) {
            const pos = {
                block: blockChain.chainEnd,
                offset: 1,
            };
            this.insertChainRight(blockChain);
            return pos;
        }
    }

    @action
    insertChainLeft(blockChain: IBlock) {
        if (blockChain == null) {
            return;
        }

        const start = blockChain.chainStart;
        const end = blockChain.chainEnd;

        // first lets take care of our parent
        if (this._parent != null) {
            this._parent.replaceChild(this, start);
        }

        // [oldLeft] [this]
        // [oldLeft] [block] [this]
        const oldLeft = this._left;
        if (oldLeft != null) {
            start.setLeft(oldLeft);
            oldLeft.setRight(start);
        }

        this._left = end;
        end.setRight(this);
    }

    @action
    insertChainRight(blockChain: IBlock) {
        if (blockChain == null) {
            return;
        }

        const start = blockChain.chainStart;
        const end = blockChain.chainEnd;

        // [this] [oldRight]
        // [this] [block] [oldRight]
        const oldRight = this._right;
        if (oldRight != null) {
            oldRight.setLeft(end);
            end.setRight(oldRight);
        }

        this._right = start;
        start.setLeft(this);
    }

    @action
    remove() {
        // [oldLeft] [this] [oldRight]
        // [oldLeft] [oldRight]

        const oldLeft = this._left;
        const oldRight = this._right;

        if (oldLeft) {
            oldLeft.setRight(undefined);
        }

        if (oldRight) {
            oldRight.setLeft(undefined);
        }

        if (oldLeft && oldRight) {
            oldLeft.setRight(oldRight);
            oldRight.setLeft(oldLeft);
        }

        // a block should never have a parent and a left
        // so if this happens lets throw an invariant so we can catch the bug
        // TODO: we should remove this when the code is more mature
        invariant(this._parent != null && oldLeft != null, `block '${this.id}' had both a parent and a left`);

        // now let's take care of our parent
        if (this._parent != null) {
            this._parent.replaceChild(this, oldRight);
        }

        this._left = undefined;
        this._parent = undefined;
        this._right = undefined;
    }

    @action
    removeNext(fromOffset: number): ICursorPosition {
        fromOffset = normalizeOffset(fromOffset);

        let nextPos: ICursorPosition = null;

        switch (true) {

            case fromOffset === 0 && this.left != null:
                return this.left.removeNext(-1);

            case fromOffset === 0 && this._parent != null:
                return this._parent.removeNextOutOfChild(Dir.Left, this);

            case fromOffset === 1 && this.left != null:
                nextPos = { block: this.left, offset: 1 };
                this.remove();
                break;

            case fromOffset === 1 && this.right != null:
                nextPos = { block: this.right, offset: 0 };
                this.remove();
                break;

            case fromOffset === 1 && this._parent != null:
                // we need to replace ourself with a blank
                // const blank = BlockBuilder.blank();
                return this._parent.removeChild(this);
                // return { block: blank, offset: 0 };

            default:
                break;
        }

        return nextPos;
    }

    @action
    removeNextRight(fromOffset: number): ICursorPosition {
        if (fromOffset === 1 && this.right != null) {
            return this.right.removeNext(1);
        }

        if (fromOffset === 1 && this.parent != null) {
            return this.parent.removeNextOutOfChild(Dir.Right, this);
        }

        if (fromOffset === 1) {
            return null;
        }

        return this.removeNext(fromOffset + 1);
    }

    @action
    replaceEntireChain(newChain: IBlock) {
        if (newChain == null) {
            return;
        }

        const oldStart = this.chainStart;
        const newStart = newChain.chainStart;

        const parent = oldStart.parent;

        if (parent == null) {
            return;
        }

        parent.replaceChild(oldStart, newStart);
    }

    @action
    replaceWith(blockChain: IBlock) {
        if (blockChain == null) {
            return;
        }

        const start = blockChain.chainStart;
        const end = blockChain.chainEnd;

        // [oldLeft] [this] [oldRight]
        // [oldLeft] [start] [end] [oldRight]

        const oldLeft = this._left;
        const oldRight = this._right;
        const oldParent = this._parent;

        start.setLeft(oldLeft);
        end.setRight(oldRight);

        if (oldLeft) {
            oldLeft.setRight(start);
        }

        if (oldRight) {
            oldRight.setLeft(end);
        }

        if (oldParent) {
            oldParent.replaceChild(this, start);
        }

        // reset links
        this._left = undefined;
        this._parent = undefined;
        this._right = undefined;
    }

    @action
    setLeft(block: IBlock) {
        this._left = block;
    }

    @action
    setParent(block: ICompositeBlock, chainNumber: number) {
        if (this.isChainStart) {
            this._chainNumber = chainNumber;
            this._parent = block;
        } else {
            this.chainStart.setParent(block, chainNumber);
        }
    }

    @action
    setRight(block: IBlock) {
        this._right = block;
    }

    @action
    splitAt(offset: number) {
        offset = normalizeOffset(offset);
        const parent = this._parent;
        const left = this.left;
        const right = this.right;

        if (offset === 0) {
            parent && parent.removeChild(this);
            left && left.setRight(null);
            this.setLeft(null);
        } else {
            right.setLeft(null);
            this.setRight(null);
        }
    }

    clone(): IBlock {
        return new Block(this._text, this._latex);
    }

    cloneDeep(): IBlock {
        const clone = this.clone();
        if (this.right) {
            const rightClone = this.right.cloneDeep();
            clone.insertChainRight(rightClone);
        }
        return clone;
    }

    toCalchub(): string {
        return this.toCalchubOutput().text;
    }

    toCalchubOutput(): Output {
        let text = this._latex || this._text || '';

        if (text.startsWith('\\') && this.right) {
            // this is a command and there is something to the right
            text = text + ' ';
        }

        return Output.fromOne({ text, source: this });
    }

    toJS(): BlockChainState {
        const js = this.toJSShallow();
        if (this.right) {
            return [js, ...this.right.toJS()];
        } else {
            return [js];
        }
    }

    toJSShallow(): IBlockState {
        return omitNulls({
            id: this.id,
            type: this.type,
            text: this._text,
            latex: this._latex,
        });
    }

    // for dev purposes
    toShorthand(): any[] {
        const shorthand = omitNulls({
            type: this.type,
            latex: this._latex,
            text: this.text,
        });

        if (this.right) {
            return [shorthand].concat(this.right.toShorthand());
        } else {
            return [shorthand];
        }
    }

    static fromJS(props: IBlockState): Block {
        const { id, text, latex } = props;
        return new Block(text, latex, BlockType.Block, id);
    }
}
