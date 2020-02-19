import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import { StaticMath } from 'pretty-math/components';
import { BlockUtils, EntryType, LibraryEntry, MathEngine } from 'pretty-math/internal';
import * as React from 'react';

export interface ILibraryEntryItemProps {
    engine?: MathEngine;
    entry: LibraryEntry;
    focused: boolean;
}

export const LibraryEntryItem = observer((props: ILibraryEntryItemProps) => {
    const { entry, focused } = props;

    switch (entry.type) {

        case EntryType.DefinedVar:
        case EntryType.DefinedFunc:
            return <DefinedEntry {...props} />;

        default:
            return <BaseEntry entry={entry} focused={focused} />;
    }
});

export interface IBaseEntryProps {
    entry: LibraryEntry;
    focused: boolean;
    engine?: MathEngine;
}

export const BaseEntry = inject('engine')(observer((props: IBaseEntryProps) => {
    const { entry, focused, engine } = props;

    return (
        <LibraryEntryItemWrapper
            entry={entry}
            focused={focused}
        >
            <div className="expr-preview">
                <StaticMath math={entry.preview} fontSize={22} mathContext={engine.mathContext} />
            </div>
            <div className="descr">
                {entry.descr}
            </div>
        </LibraryEntryItemWrapper>
    );
}));

export interface IDefinedEntryProps {
    entry: LibraryEntry;
    focused: boolean;
    engine?: MathEngine;
}

export const DefinedEntry = inject('engine')(observer((props: IDefinedEntryProps) => {
    const { entry, focused, engine } = props;
    const mathExpr = entry.mathExprRef;

    return (
        <LibraryEntryItemWrapper
            entry={entry}
            focused={focused}
        >
            <div className="expr-preview">
                <StaticMath math={(entry.preview || entry.autocomplete || entry.latex)} fontSize={22} mathContext={engine.mathContext} />
            </div>
            <div className="descr">
                {
                    mathExpr
                    ? <StaticMath expr={mathExpr.expr} mathContext={engine.mathContext} />
                    : entry.descr
                }
            </div>
        </LibraryEntryItemWrapper>
    );
}));

export interface ILibraryEntryItemWrapperProps {
    children?: React.ReactNode;
    engine?: MathEngine;
    entry: LibraryEntry;
    focused: boolean;
}

@inject('engine')
@observer
export class LibraryEntryItemWrapper extends React.Component<ILibraryEntryItemWrapperProps, {}> {

    constructor(props: ILibraryEntryItemWrapperProps) {
        super(props);
    }

    render() {
        const { entry, focused, engine } = this.props;

        const classes = classNames(
            'library-entry-item',
            { focused }
        );

        const handleMouseDown = (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            BlockUtils.replaceFocusedTokenWithLibraryEntry(engine.selection, entry);
            engine.assistant.library.forceClose();
        };

        return (
            <li
                className={classes}
                onClick={handleMouseDown}
                ref={this.setRef}
            >
                {this.props.children}
            </li>
        );
    }

    setRef = (ref: HTMLLIElement) => {
        this.props.entry.ref = ref;
    }
}
