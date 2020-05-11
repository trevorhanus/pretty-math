import {
    Editor,
    LibraryEntryConfig,
    LibraryEntry,
    removeTrailingPhrase,
    BlockFactory,
    isType,
} from 'pretty-math2/internal';

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
        onSelect: (editor: Editor, entry: LibraryEntry, searchTerm?: string) => {
            removeTrailingPhrase(editor, searchTerm);
            editor.insertBlock(BlockFactory.createBlock('atomic', { text: '+' }));
        }
    },
    {
        keywords: ['fraction', 'divide'],
        category: 'Algebra',
        description: 'Fraction',
        preview: {
            root: {
                type: 'root:math',
                children: {
                    inner: [
                        { type: 'math:fraction' },
                    ]
                }
            }
        },
        onSelect: (editor: Editor, entry: LibraryEntry, phrase?: string) => {
            removeTrailingPhrase(editor, phrase);
            const block = BlockFactory.createBlock('math:fraction');
            editor.insertBlock(block);
            editor.selection.anchorAt(block.childMap.num.start);
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
        onSelect: (editor: Editor, entry: LibraryEntry, phrase?: string) => {
            removeTrailingPhrase(editor, phrase);

            const data = {
                text: '∞',
                calchub: '\\inf',
                python: 'INF'
            };

            editor.insertBlock(BlockFactory.createBlock('math:symbol', data));
        }
    },
    {
        keywords: ['square', 'root', 'radical'],
        category: 'Algebra',
        description: 'Radical',
        preview: {
            root: {
                type: 'root:math',
                children: {
                    inner: [
                        { type: 'math:radical' },
                    ]

                }
            }
        },
        onSelect: (editor: Editor, entry: LibraryEntry, phrase?: string) => {
            removeTrailingPhrase(editor, phrase);
            const block = BlockFactory.createBlock('math:radical');
            editor.insertBlock(block);
            editor.selection.anchorAt(block.childMap.inner.start);
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
        onSelect: (editor: Editor, entry: LibraryEntry, phrase?: string) => {
            removeTrailingPhrase(editor, phrase);

            const data = {
                text: c.text,
                calchub: c.calchub,
                python: c.python,
            };

            editor.insertBlock(BlockFactory.createBlock('math:symbol', data));
        }
    };
});

const trig = [
    {
        keywords: ['arccos', 'acos'],
        description: 'Inverse cosine of a value',
        calchub: '\\arccos',
        displayValue: 'acos',
        python: 'Acos',
    },
    {
        keywords: ['arcsin', 'asin'],
        description: 'Inverse sine of a value',
        calchub: '\\arcsin',
        displayValue: 'asin',
        python: 'Asin',
    },
    {
        keywords: ['arctan', 'atan'],
        description: 'Inverse tangent of a value',
        calchub: '\\arctan',
        displayValue: 'atan',
        python: 'Atan',
    },
    {
        keywords: ['acosh', 'hyperbolic', 'cosine'],
        description: 'Inverse hyperbolic cosine of a value',
        calchub: '\\chacosh',
        displayValue: 'acosh',
        python: 'Acosh',
    },
    {
        keywords: ['asinh', 'hyperbolic', 'sine'],
        description: 'Invserse hyperbolic sine of a real number',
        calchub: '\\chasinh',
        displayValue: 'asinh',
        python: 'Asinh',
    },
    {
        keywords: ['atanh', 'hyperbolic', 'tangent', 'trig'],
        description: 'Invserse hyperbolic tangent of a real number',
        calchub: '\\chatanh',
        displayValue: 'atanh',
        python: 'Atanh',
    },
    {
        keywords: ['cosine'],
        description: 'Cosine of a value',
        calchub: '\\cos',
        displayValue: 'cos',
        python: 'Cos',
    },
    {
        keywords: ['cosh', 'hyperbolic'],
        description: 'Hyperbolic cosine of a value',
        calchub: '\\cosh',
        displayValue: 'cosh',
        python: 'Cosh',
    },
    {
        keywords: ['cot', 'tagent'],
        description: 'Cotangent of a value',
        calchub: '\\cot',
        displayValue: 'cot',
        python: 'Cot',
    },
    {
        keywords: ['coth', 'tagent'],
        description: 'Hyperbolic cotangent of a value',
        calchub: '\\coth',
        displayValue: 'coth',
        python: 'Coth',
    },
    {
        keywords: ['csc'],
        description: 'Cosecant of a value',
        calchub: '\\csc',
        displayValue: 'csc',
        python: 'Csc',
    },
    {
        keywords: ['sine'],
        description: 'Sine of a value',
        calchub: '\\sin',
        displayValue: 'sin',
        python: 'Sin',
    },
    {
        keywords: ['sinh'],
        description: 'Hyperbolic sine of a value',
        calchub: '\\sinh',
        displayValue: 'sinh',
        python: 'Sinh',
    },
    {
        keywords: ['tangent'],
        description: 'Tangent of a value',
        calchub: '\\tan',
        displayValue: 'tan',
        python: 'Tan',
    },
    {
        keywords: ['tanh'],
        description: 'Hyperbolic tangent of a real number',
        calchub: '\\tanh',
        displayValue: 'tanh',
        python: 'Tanh',
    },
].map(trig => {
    return {
        keywords: trig.keywords,
        category: 'Trig',
        description: trig.description,
        preview: {
            root: {
                type: 'root:math',
                children: {
                    inner: [
                        {
                            type: 'math:function',
                            data: {
                                displayValue: trig.displayValue,
                            },
                        },
                    ]

                }
            }
        },
        onSelect: (editor: Editor, entry: LibraryEntry, phrase?: string) => {
            removeTrailingPhrase(editor, phrase);

            const data = {
                displayValue: trig.displayValue,
                calchub: trig.calchub,
                python: trig.python,
            };

            const block = BlockFactory.createBlock('math:function', data);
            editor.insertBlock(block);
            editor.selection.anchorAt(block.childMap.inner.start);
        }
    }
});

const calculus = [
    {
        keywords: ['derivative', 'differentiate'],
        category: 'Calculus',
        description: 'Derivative',
        preview: {
            root: {
                type: 'root:math',
                children: {
                    inner: [
                        {
                            type: 'math:derivative',
                            children: {
                                wrt: [
                                    {
                                        type: 'math:differential',
                                        data: {
                                            displayValue: 'd',
                                        },
                                        children: {
                                            inner: [
                                                {
                                                    type: 'atomic',
                                                    data: {
                                                        text: 'x',
                                                    }
                                                }
                                            ]

                                        }
                                    }
                                ],
                                inner: [
                                    {
                                        type: 'atomic',
                                        data: {
                                            text: 'x',
                                        }
                                    }
                                ]
                            }

                        },
                    ]

                }
            }
        },
        onSelect: (editor: Editor, entry: LibraryEntry, phrase?: string) => {
            removeTrailingPhrase(editor, phrase);
            const block = BlockFactory.createBlock('math:derivative');
            const differential = BlockFactory.createBlock('math:differential', { displayValue: 'd' });
            block.childMap.wrt.insertBlock(block.childMap.wrt.start, differential);
            editor.insertBlock(block);
            editor.selection.anchorAt(differential.childMap.inner.end);
        }
    },
    {
        keywords: ['differential'],
        category: 'Calculus',
        description: 'Differential',
        doSuggest: (editor: Editor) => {
            const { focus } = editor.selection;
            return isType(focus.parent, 'math:derivative') && focus.list.name === 'wrt';
        },
        preview: {
            root: {
                type: 'root:math',
                children: {
                    inner: [
                        {
                            type: 'math:differential',
                            data: {
                                displayValue: 'd',
                            },
                            children: {
                                inner: [
                                    {
                                        type: 'atomic',
                                        data: {
                                            text: 'x',
                                        }
                                    }
                                ]

                            }
                        }
                    ]

                }
            }
        },
        onSelect: (editor: Editor, entry: LibraryEntry, phrase?: string) => {
            removeTrailingPhrase(editor, phrase);
            const block = BlockFactory.createBlock('math:differential', { displayValue: 'd' });
            editor.insertBlock(block);
            editor.selection.anchorAt(block.childMap.inner.start);
        }
    }
];

const mathEntries = [...algebra, ...greek, ...trig, ...calculus];

export {
    mathEntries,
}
