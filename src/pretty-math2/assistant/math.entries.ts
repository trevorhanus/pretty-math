import { EditorState } from '../model/EditorState';
import { LibraryEntryConfig } from './library/LibraryEntry';

const algebra: LibraryEntryConfig[] = [
    {
        keywords: ['addition', 'plus'],
        description: 'Add two arguments',
        preview: {
            root: {
                type: 'root:math',
                children: {
                    inner: [
                        {
                            type: 'atomic',
                            data: { text: 'a' },
                        },
                        {
                            type: 'atomic',
                            data: { text: '+' },
                        },
                        {
                            type: 'atomic',
                            data: { text: 'b' },
                        }
                    ]

                }
            }
        },
        onSelect: (editorState: EditorState) => {
            console.log('selected!');
        }
    },
    {
        keywords: ['infinity'],
        description: 'Infinity',
        preview: {
            root: {
                type: 'root:math',
                children: {
                    inner: [
                        {
                            type: 'math:symbol',
                            data: { text: '∞' },
                        },
                    ]

                }
            }
        },
        onSelect: (editorState: EditorState) => {
            const data = {
                text: '∞',
                calchub: '\\inf',
                python: 'INF'
            };
            console.log('selected!');
        }
    },
];

const mathEntries = [...algebra];

export {
    mathEntries,
}
