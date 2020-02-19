import { action, autorun, computed, observable } from 'mobx';
import { MathContext } from 'math';
import { INode, parseCalchub, ParseResult, toShorthand } from 'math';
import { IBlock, IDecorator, MathBlockDecor, RootBlock } from 'pretty-math/internal';
import { BlockSourceMap, getStartIndexForBlock } from 'pretty-math/utils';

export class MathDecorator implements IDecorator {
    readonly mathCxt: MathContext;
    @observable.ref private _parseResult: ParseResult;
    @observable.ref private _blockSourceMap: BlockSourceMap;

    constructor(mathCxt?: MathContext) {
        this.mathCxt = mathCxt;
        this._parseResult = null;
        this._blockSourceMap = null;
    }

    @computed
    get parseResult(): ParseResult {
        return this._parseResult;
    }

    getDecorForBlock(block: IBlock): MathBlockDecor {
        let node: INode = null;

        if (this._blockSourceMap && this._parseResult) {
            const i = getStartIndexForBlock(block, this._blockSourceMap);
            node = this._parseResult.sourceMap[i];
        }

        return new MathBlockDecor(node, block, this.mathCxt);
    }

    @action
    handleChange(calchub: string, blockSourceMap: BlockSourceMap) {
        if (calchub == null || calchub === '') {
            this._parseResult = null;
            this._blockSourceMap = null;
            return;
        }

        try {
            const fnNames = this.mathCxt ? this.mathCxt.fnNames : [];
            const parseResult = parseCalchub(calchub, fnNames);

            if (parseResult.error) {
                console.log(toShorthand(parseResult.tokens));
                console.log(parseResult.error);
                // couldn't form a proper AST
                // leave the previous result
                return;
            }

            this._blockSourceMap = blockSourceMap;
            this._parseResult = parseResult;
        } catch (e) {
            console.log(`[pretty-math] Error parsing '${calchub}' in decorator.`);
            this._blockSourceMap = null;
            this._parseResult = null;
        }
    }

    initializeDecorAndWatchForChanges(root: RootBlock) {
        autorun(() => {
            const { text, sourceMap } = root.toCalchubOutput();
            this.handleChange(text, sourceMap);
        });
    }
}
