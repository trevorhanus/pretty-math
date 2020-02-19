import { EditableEngine, UnitsDecorator, UnitsHandler } from 'pretty-math/internal';

export class UnitsEngine extends EditableEngine {
    readonly decorator: UnitsDecorator;

    constructor() {
        super();
        this.decorator = new UnitsDecorator();
        this.setHandler(new UnitsHandler(this));
    }
}
