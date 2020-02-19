import { action, computed, observable } from 'mobx';
import { MathContext, MathExpr } from 'math';
import { AssistantStore, EditableEngine, getLibrary, Library, MathDecorator, MathHandler } from 'pretty-math/internal';

export class MathEngine extends EditableEngine {
    readonly assistant: AssistantStore;
    readonly decorator: MathDecorator;
    readonly mathContext: MathContext;
    @observable.ref private _mathExpr: MathExpr;

    constructor(mathCxt?: MathContext) {
        super();
        this.assistant = new AssistantStore(this);
        this.decorator = new MathDecorator(mathCxt);
        this.mathContext = mathCxt;
        this.setHandler(new MathHandler(this));
        this.decorator.initializeDecorAndWatchForChanges(this.root);
        this.selection.anchorAtStart();
    }

    get library(): Library {
        return getLibrary();
    }

    @computed
    get mathExpr(): MathExpr {
        return this._mathExpr;
    }

    @action
    handleTextareaBlur() {
        this.assistant.reset();
        super.handleTextareaBlur();
    }

    @action
    setMathExpr(expr: MathExpr) {
        this._mathExpr = expr;
    }

}
