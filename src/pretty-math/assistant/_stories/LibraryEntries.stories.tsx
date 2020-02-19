import { storiesOf } from '@storybook/react';
import { MathContext } from 'math';
import { observer, Provider } from 'mobx-react';
import { ValidatedField } from 'mobx-validated-field';
import { LibraryEntryItem } from 'pretty-math/assistant/LibraryEntryItem';
import { getLibrary, MathEngine } from 'pretty-math/internal';
import * as React from 'react';
import { InputGroup } from '~/ui-kit/forms/InputGroup';

storiesOf('Pretty Math/Assistant', module)

    .add('Library Entries', () => {
        return <LibraryStory />
    });

@observer
export class LibraryStory extends React.Component<{}, {}> {
    mathCxt: MathContext;
    engine: MathEngine;
    searchField: ValidatedField;

    constructor(props: {}) {
        super(props);
        this.mathCxt = new MathContext();
        this.engine = new MathEngine(this.mathCxt);
        this.engine.init({});
        this.searchField = new ValidatedField();
    }

    render() {
        const entries = this.searchField.value ? getLibrary().search(this.searchField.value) : getLibrary().allEntries;

        return (
            <Provider engine={this.engine}>
                <div className="container mx-auto pt-4 fixed pin overflow-auto">
                    <div>
                        <InputGroup field={this.searchField} />
                    </div>
                    <div className="w-full flex justify-center pt-4">
                        <div className="assistant">
                            <div className="library">
                                <ul className="library-entry-list">
                                    {
                                        entries.map((entry, i) => {
                                            return <LibraryEntryItem key={i} entry={entry} focused={false} />
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </Provider>
        )
    }
}
