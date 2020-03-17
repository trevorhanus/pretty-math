import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import { LibraryEntryList } from 'pretty-math/components';
import { LibraryEntry, LibraryTab, MathEngine, ViewState } from 'pretty-math/internal';
import * as React from 'react';

export interface ILibraryProps {
    engine?: MathEngine;
    onSelect?: (entry: LibraryEntry) => void;
}

@inject('engine')
@observer
export class Library extends React.Component<ILibraryProps, {}> {

    constructor(props: ILibraryProps) {
        super(props);
    }

    componentDidMount() {
        const { library } = this.props.engine.assistant;
        library.handleMount();
    }

    componentWillUnmount() {
        const { library } = this.props.engine.assistant;
        library.handleUnmount();
    }

    render() {
        const { engine } = this.props;
        const { library } = engine.assistant;

        const libraryClassName = classNames(
            'library',
            library.viewState === ViewState.FullLibrary && 'full-library',
        );

        let content = null;

        switch (library.viewState) {

            case ViewState.FullLibrary:
                content = (
                    <>
                        <div className="tabs">
                            {
                                library.tabsToRender.map(tab => {
                                    return <Tab key={tab} tab={tab} />
                                })
                            }
                        </div>
                        <div className="tab-content">
                            <LibraryEntryList
                                entries={library.libraryEntriesToRender}
                                onSelect={this.handleEntrySelect}
                            />
                        </div>
                    </>
                );
                break;

            default:
                content = (
                    <LibraryEntryList
                        entries={library.libraryEntriesToRender}
                        onSelect={this.handleEntrySelect}
                    />
                );
        }

        return (
            <div
                className={libraryClassName}
                onWheel={this.handleWheel}
            >
                {content}
            </div>
        )
    }

    handleEntrySelect = (entry: LibraryEntry) => {
        this.props.onSelect && this.props.onSelect(entry);
    };

    handleWheel = (e: React.WheelEvent) => {
        e.stopPropagation();
    };
}

export interface ITabProps {
    tab: LibraryTab;
    engine?: MathEngine;
}

const Tab = inject('engine')(observer((props: ITabProps) => {
    const { tab, engine } = props;
    const { library } = engine.assistant;
    const classes = classNames(
        'tab',
        { 'active-tab': library.activeTab === tab }
    );

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        library.activateTab(tab);
    };

    return (
        <div
            className={classes}
            onMouseDown={handleMouseDown}
        >
            {tab}
        </div>
    )
}));
