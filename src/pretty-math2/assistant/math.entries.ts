import { BlockFactory } from '../blocks/BlockFactory';
import { Editor } from '../model/Editor';
import { LibraryEntryConfig } from './library/LibraryEntry';

const algebra: LibraryEntryConfig[] = [
    {
        keywords: ['addition', 'plus'],
        category: 'Algebra',
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
        onSelect: (editor: Editor) => {
            // editor.removeRange(editor.selection.trailingPhraseRange);
            // editor.insertBlock(BlockFactory.createBlock('atomic', { text: '+' }));
            console.log('Addition selected!');
        }
    },
    {
        keywords: ['infinity'],
        category: 'Algebra',
        description: 'Infinity',
        preview: {
            root: {
                type: 'root:math',
                children: {
                    inner: [
                        {
                            type: 'math:symbol',
                            data: {
                                text: '∞',
                                calchub: '\\inf',
                                python: 'Infinity',
                            },
                        },
                    ]

                }
            }
        },
        onSelect: (editorState: Editor) => {
            const data = {
                text: '∞',
                calchub: '\\inf',
                python: 'INF'
            };
            console.log('Infinity selected!');
        }
    },
];

const greek = [
    {
        keywords: ['alpha'],
        description: 'Greek lowercase alpha',
        text: 'α',
        calchub: '\\alpha',
        python: 'greek_alpha',
    },
    {
        keywords: ['beta'],
        description: 'Lowercase Greek beta',
        calchub: '\\beta',
        text: 'β',
        python: 'greek_beta',
    },
    {
        keywords: ['gamma'],
        description: 'Greek lowercase gamma',
        calchub: '\\gamma',
        text: 'γ',
        python: 'greek_gamma'
    },
    {
        keywords: ['delta'],
        description: 'Greek lowercase delta',
        calchub: '\\delta',
        text: 'δ',
        python: 'greek_delta',
    },
    {
        keywords: ['epsilon'],
        description: 'Greek lowercase epsilon',
        calchub: '\\epsilon',
        text: 'ε',
        python: 'greek_epsilon',
    },
    {
        keywords: ['zeta'],
        description: 'Greek lowercase zeta',
        calchub: '\\zeta',
        text: 'ζ',
        python: 'greek_zeta',
    },
    {
        keywords: ['eta'],
        description: 'Greek lowercase eta',
        calchub: '\\eta',
        text: 'η',
        python: 'eta',
    },
    {
        keywords: ['theta'],
        description: 'Greek lowercase theta',
        calchub: '\\theta',
        text: 'θ',
        python: 'greek_theta',
    },
    {
        keywords: ['kappa'],
        description: 'Greek lowercase kappa',
        calchub: '\\kappa',
        text: 'κ',
        python: 'greek_kappa',
    },
    {
        keywords: ['lambda'],
        description: 'Greek lowercase lambda',
        calchub: '\\lambda',
        text: 'λ',
        python: 'greek_lambda',
    },
    {
        keywords: ['mu'],
        description: 'Greek lowercase mu',
        calchub: '\\mu',
        text: 'μ',
        python: 'greek_mu',
    },
    {
        keywords: ['nu'],
        description: 'Greek lowercase nu',
        calchub: '\\nu',
        text: 'ν',
        python: 'greek_nu',
    },
    {
        keywords: ['xi'],
        description: 'Greek lowercase xi',
        calchub: '\\xi',
        text: 'ξ',
        python: 'greek_xi',
    },
    {
        keywords: ['pi'],
        description: 'Greek lowercase pi',
        calchub: '\\pi',
        text: 'π',
        python: 'greek_pi',
    },
    {
        keywords: ['rho'],
        description: 'Greek lowercase rho',
        calchub: '\\rho',
        text: 'ρ',
        python: 'greek_rho',
    },
    {
        keywords: ['sigma'],
        description: 'Greek lowercase sigma',
        calchub: '\\sigma',
        text: 'σ',
        python: 'greek_sigma',
    },
    {
        keywords: ['tau'],
        description: 'Greek lowercase tau',
        calchub: '\\tau',
        text: 'τ',
        python: 'greek_tau',
    },
    {
        keywords: ['upsilon'],
        description: 'Greek lowercase upsilon',
        calchub: '\\upsilon',
        text: 'υ',
        python: 'greek_upsilon',
    },
    {
        keywords: ['phi'],
        description: 'Greek lowercase phi',
        calchub: '\\phi',
        text: 'φ',
        python: 'greek_phi',
    },
    {
        keywords: ['chi'],
        description: 'Greek lowercase chi',
        calchub: '\\chi',
        text: 'χ',
        python: 'greek_chi',
    },
    {
        keywords: ['psi'],
        description: 'Greek lowercase psi',
        calchub: '\\psi',
        text: 'ψ',
        python: 'greek_psi',
    },
    {
        keywords: ['omega'],
        description: 'Greek lowercase omega',
        calchub: '\\omega',
        text: 'ω',
        python: 'greek_omega',
    },
].map(c => {
    return {
        keywords: c.keywords,
        category: 'Greek',
        description: c.description,
        preview: {
            root: {
                type: 'root:math',
                children: {
                    inner: [
                        {
                            type: 'math:symbol',
                            data: {
                                text: c.text,
                                calchub: c.calchub,
                                python: c.python,
                            },
                        },
                    ]

                }
            }
        },
        onSelect: (editor: Editor) => {
            // editor.removeRange(editor.selection.trailingPhraseRange);
            // editor.insertBlock(BlockFactory.createBlock('atomic', { text: '+' }));
            console.log('Alpha selected!');
        }
    };
});

const mathEntries = [...algebra, ...greek];

export {
    mathEntries,
}
