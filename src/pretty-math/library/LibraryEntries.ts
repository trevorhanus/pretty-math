import { BlockType, isDerivativeBlock, LibraryEntryJS, MathEngine } from 'pretty-math/internal';

export const ALGEBRA: LibraryEntryJS[] = [
    {
        keywords: ['addition', 'plus'],
        descr: 'Add two arguments',
        preview: 'a + b',
        autocomplete: '+'
    },
    {
        keywords: ['equals'],
        descr: 'Assignment operator',
        preview: 'a=b',
        autocomplete: '=',
    },
    {
        keywords: ['fraction', 'frac'],
        descr: 'Enter a fraction',
        preview: '\\frac{x}{y}',
        autocomplete: '/',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
    {
        keywords: ['minus'],
        descr: 'Subtract two values',
        preview: 'a - b',
        autocomplete: '-',
    },
    {
        keywords: ['superscript', 'power'],
        descr: 'Enter a superscript, or type ^',
        preview: '2^{x}',
        autocomplete: [
            {
                type: BlockType.SupSub,
                sup: [
                    {
                        type: BlockType.Blank,
                    }
                ]
            }
        ],
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
    {
        keywords: ['inf', 'infinity'],
        descr: 'Infinity',
        latex: '\\inf',
        text: '∞',
    }
];

export const CALCULUS: LibraryEntryJS[] = [
    {
        keywords: ['differential', 'd'],
        descr: 'A differential',
        preview: '\\wrt{x}',
        autocomplete: '\\wrt{}',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
        doSuggest: (engine: MathEngine) => {
            // only suggest if the focus is in
            // the denominator of a derivative block
            const focus = engine.selection.focus;
            if (focus.block && isDerivativeBlock(focus.block.parent) &&
                focus.block.chainStart === focus.block.parent.wrt) {
                    return true;
            }
        }
    },
    {
        keywords: ['partial', 'differential', 'd'],
        descr: 'A partial differential',
        preview: '\\pwrt{x}',
        autocomplete: '\\pwrt{}',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
        doSuggest: (engine: MathEngine) => {
            // only suggest if the focus is in
            // the denominator of a derivative block
            const focus = engine.selection.focus;
            if (focus.block && isDerivativeBlock(focus.block.parent) &&
                focus.block.chainStart === focus.block.parent.wrt) {
                    return true;
            }
        }
    },
    {
        keywords: ['derivative', 'der'],
        descr: 'Calculate the derivative of an expression.',
        preview: '\\diff{x,\\wrt{x}}',
        autocomplete: '\\diff{,\\wrt{}}',
        cursorOnInsert: { blockPos: '0.1:0.1:0', offset: 0 },
    },
    {
        keywords: ['definite', 'integral', 'int'],
        descr: 'Integrate f(x) from x=a to a=b.',
        preview: '\\int{f(x),x,a,b}',
        autocomplete: [{
            type: BlockType.Integral,
            leftBound: [
                { type: BlockType.Blank }
            ],
            rightBound: [
                { type: BlockType.Blank }
            ],
        }],
        cursorOnInsert: { blockPos: '0.2:0', offset: 0 },
    },
    {
        keywords: ['indefinite', 'integral', 'int'],
        descr: 'Indefinite integral of f(x).',
        preview: '\\int{f(x),x}',
        autocomplete: [{
            type: BlockType.Integral
        }],
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
];

export const FUNCTIONS: LibraryEntryJS[] = [
    {
        keywords: ['abs'],
        descr: 'Absolute value of a number',
        latex: '\\chabs',
        text: 'abs',
        preview: '\\chabs{x}',
        autocomplete: '\\chabs{}',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
    {
        keywords: ['log'],
        descr: 'Log of a number',
        latex: '\\log',
        text: 'log',
        preview: '\\log{x}',
        autocomplete: '\\log{}',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
    {
        keywords: ['ln'],
        descr: 'Natural log of a number',
        latex: '\\ln',
        text: 'ln',
        autocomplete: '\\ln{}',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
    {
        keywords: ['min'],
        descr: 'Minimum value of a list of numbers',
        latex: '\\chmin',
        text: 'min',
        autocomplete: '\\chmin{}',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
    {
        keywords: ['max'],
        descr: 'Maximum value of a list of numbers',
        latex: '\\chmax',
        text: 'max',
        autocomplete: '\\chmax{}',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
    {
        keywords: ['sqrt', 'radical', 'square root'],
        descr: 'Square root of a positive number',
        latex: '\\sqrt',
        text: null,
        autocomplete: '\\sqrt{}',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
    {
        keywords: ['sum'],
        descr: 'Sum a list of numbers',
        latex: '\\chsum',
        text: 'sum',
        autocomplete: '\\chsum{}',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
];

export const LINEAR_ALGEBRA: LibraryEntryJS[] = [
    {
        keywords: ['matrix'],
        descr: 'A Matrix',
        preview: '\\matrix[[a, b], [c, d]]',
        autocomplete: '\\matrix[[,], [,]]',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
    {
        keywords: ['identity'],
        descr: 'An identiry Matrix',
        preview: '\\matrix[[1, 0, 0], [0, 1, 0], [0, 0, 1]]',
        autocomplete: '\\matrix[[1, 0, 0], [0, 1, 0], [0, 0, 1]]',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
    {
        keywords: ['vector'],
        descr: 'A 1x3 matrix',
        preview: '\\matrix[[a, b ,c]]',
        autocomplete: '\\matrix[[,,]]',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
    {
        keywords: ['cross', 'cross product'],
        descr: 'Cross Product',
        latex: '\\crossp',
        text: '\u2a2f',
    },
    {
        keywords: ['dot', 'dot product'],
        descr: 'Dot Product',
        latex: '\\dotp',
        text: '\u2219',
    },
];

export const TRIG: LibraryEntryJS[] = [
    {
        keywords: ['arccos', 'acos'],
        descr: 'Inverse cosine of a value',
        latex: '\\arccos',
        text: 'acos',
        autocomplete: '\\arccos{}',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
    {
        keywords: ['arcsin', 'asin'],
        descr: 'Inverse sine of a value',
        latex: '\\arcsin',
        text: 'asin',
        autocomplete: '\\arcsin{}',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
    {
        keywords: ['arctan', 'atan'],
        descr: 'Inverse tangent of a value',
        latex: '\\arctan',
        text: 'atan',
        autocomplete: '\\arctan{}',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
    {
        keywords: ['acosh', 'hyperbolic', 'cosine'],
        descr: 'Inverse hyperbolic cosine of a value',
        latex: '\\chacosh',
        text: 'acosh',
        autocomplete: '\\chacosh{}',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
    {
        keywords: ['asinh', 'hyperbolic', 'sine', 'trig'],
        descr: 'Invserse hyperbolic sine of a real number',
        latex: '\\chasinh',
        text: 'asinh',
        autocomplete: '\\chasinh{}',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
    {
        keywords: ['atanh', 'hyperbolic', 'tangent', 'trig'],
        descr: 'Invserse hyperbolic tangent of a real number',
        latex: '\\chatanh',
        text: 'atanh',
        autocomplete: '\\chatanh{}',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
    {
        keywords: ['cos', 'cosine'],
        descr: 'Cosine of a value',
        latex: '\\cos',
        text: 'cos',
        autocomplete: '\\cos{}',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
    {
        keywords: ['cosh', 'hyperbolic', 'cosine'],
        descr: 'Hyperbolic cosine of a value',
        latex: '\\cosh',
        text: 'cosh',
        autocomplete: '\\cosh{}',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
    {
        keywords: ['cot', 'tangent'],
        descr: 'Cotangent of a value',
        latex: '\\cot',
        text: 'cot',
        autocomplete: '\\cot{}',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
    {
        keywords: ['coth', 'tangent'],
        descr: 'Hyperbolic cotangent of a value',
        latex: '\\coth',
        text: 'coth',
        autocomplete: '\\coth{}',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
    {
        keywords: ['csc'],
        descr: 'Cosecant of a value',
        latex: '\\csc',
        text: 'csc',
        autocomplete: '\\csc{}',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
    {
        keywords: ['sin'],
        descr: 'Sine of a value',
        latex: '\\sin',
        text: 'sin',
        autocomplete: '\\sin{}',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
    {
        keywords: ['sinh'],
        descr: 'Hyperbolic sine of a value',
        latex: '\\sinh',
        text: 'sinh',
        autocomplete: '\\sinh{}',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
    {
        keywords: ['tan'],
        descr: 'Tangent of a value',
        latex: '\\tan',
        text: 'tan',
        autocomplete: '\\tan{}',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
    {
        keywords: ['tanh'],
        descr: 'Hyperbolic tangent of a real number',
        latex: '\\tanh',
        text: 'tanh',
        autocomplete: '\\tanh{}',
        cursorOnInsert: { blockPos: '0.1:0', offset: 0 },
    },
];

export const GREEK_SYMBOLS: LibraryEntryJS[] = [

    /**
     * Lowercase Greeks
     */

    {
        keywords: ['alpha'],
        descr: 'Greek lowercase alpha',
        latex: '\\alpha',
        text: 'α',
    },
    {
        keywords: ['beta'],
        descr: 'Lowercase Greek beta',
        latex: '\\beta',
        text: 'β',
    },
    {
        keywords: ['gamma'],
        descr: 'Greek lowercase gamma',
        latex: '\\gamma',
        text: 'γ',
    },
    {
        keywords: ['delta'],
        descr: 'Greek lowercase delta',
        latex: '\\delta',
        text: 'δ',
    },
    {
        keywords: ['epsilon'],
        descr: 'Greek lowercase epsilon',
        latex: '\\epsilon',
        text: 'ε',
    },
    // TODO: not sure what the display value should be?
    // {
    //     keywords: ['varepsilon'],
    //     descr: 'Greek lowercase epsilon',
    //     latex: '\\varepsilon',
    //     displayValue: '',
    // },
    {
        keywords: ['zeta'],
        descr: 'Greek lowercase zeta',
        latex: '\\zeta',
        text: 'ζ',
    },
    {
        keywords: ['eta'],
        descr: 'Greek lowercase eta',
        latex: '\\eta',
        text: 'η',
    },
    {
        keywords: ['theta'],
        descr: 'Greek lowercase theta',
        latex: '\\theta',
        text: 'θ',
    },
    // TODO: not sure what the displayValue should be?
    // {
    //     keywords: ['vartheta'],
    //     descr: 'Greek lowercase theta',
    //     latex: '\\vartheta',
    //     displayValue: '',
    // },
    {
        keywords: ['kappa'],
        descr: 'Greek lowercase kappa',
        latex: '\\kappa',
        text: 'κ',
    },
    {
        keywords: ['lambda'],
        descr: 'Greek lowercase lambda',
        latex: '\\lambda',
        text: 'λ',
    },
    {
        keywords: ['mu'],
        descr: 'Greek lowercase mu',
        latex: '\\mu',
        text: 'μ',
    },
    {
        keywords: ['nu'],
        descr: 'Greek lowercase nu',
        latex: '\\nu',
        text: 'ν',
    },
    {
        keywords: ['xi'],
        descr: 'Greek lowercase xi',
        latex: '\\xi',
        text: 'ξ',
    },
    {
        keywords: ['pi'],
        descr: 'Greek lowercase pi',
        latex: '\\pi',
        text: 'π',
    },
    // TODO: not sure what the displayValue should be?
    // {
    //     keywords: ['varpi', 'pi'],
    //     descr: 'Greek lowercase pi',
    //     latex: '\\varpi',
    //     displayValue: 'π',
    // },
    {
        keywords: ['rho'],
        descr: 'Greek lowercase rho',
        latex: '\\rho',
        text: 'ρ',
    },
    // TODO: not sure what the displayValue should be?
    // {
    //     keywords: ['varrho'],
    //     descr: 'Greek lowercase rho',
    //     latex: '\\varrho',
    //     displayValue: '',
    // },
    {
        keywords: ['sigma'],
        descr: 'Greek lowercase sigma',
        latex: '\\sigma',
        text: 'σ',
    },
    // TODO: not sure what the displayValue should be?
    // {
    //     keywords: ['varsigma'],
    //     descr: 'Greek lowercase sigma',
    //     latex: '\\varsigma',
    //     displayValue: '',
    // },
    {
        keywords: ['tau'],
        descr: 'Greek lowercase tau',
        latex: '\\tau',
        text: 'τ',
    },
    {
        keywords: ['upsilon'],
        descr: 'Greek lowercase upsilon',
        latex: '\\upsilon',
        text: 'υ',
    },
    {
        keywords: ['phi'],
        descr: 'Greek lowercase phi',
        latex: '\\phi',
        text: 'φ',
    },
    // TODO: not sure what the displayValue should be?
    // {
    //     keywords: ['varphi'],
    //     descr: 'Greek lowercase phi',
    //     latex: '\\varphi',
    //     displayValue: '',
    // },
    {
        keywords: ['chi'],
        descr: 'Greek lowercase chi',
        latex: '\\chi',
        text: 'χ',
    },
    {
        keywords: ['psi'],
        descr: 'Greek lowercase psi',
        latex: '\\psi',
        text: 'ψ',
    },
    {
        keywords: ['omega'],
        descr: 'Greek lowercase omega',
        latex: '\\omega',
        text: 'ω',
    },

    /**
     * Uppercase Greeks
     */

    {
        keywords: ['Gamma'],
        descr: 'Greek uppercase gamma',
        latex: '\\Gamma',
        text: 'Γ',
    },
    {
        keywords: ['Delta'],
        descr: 'Greek uppercase delta',
        latex: '\\Delta',
        text: 'Δ',
    },
    {
        keywords: ['Theta'],
        descr: 'Greek uppercase theta',
        latex: '\\Theta',
        text: 'Θ',
    },
    {
        keywords: ['Lambda'],
        descr: 'Greek uppercase lambda',
        latex: '\\Lambda',
        text: 'Λ',
    },
    {
        keywords: ['Xi'],
        descr: 'Greek uppercase xi',
        latex: '\\Xi',
        text: 'Ξ',
    },
    {
        keywords: ['Pi'],
        descr: 'Greek uppercase pi',
        latex: '\\Pi',
        text: 'Π',
    },
    {
        keywords: ['Sigma'],
        descr: 'Greek uppercase sigma',
        latex: '\\Sigma',
        text: 'Σ',
    },
    {
        keywords: ['Upsilon'],
        descr: 'Greek uppercase upsilon',
        latex: '\\Upsilon',
        text: 'Υ',
    },
    {
        keywords: ['Phi'],
        descr: 'Greek uppercase phi',
        latex: '\\Phi',
        text: 'Φ',
    },
    {
        keywords: ['Psi'],
        descr: 'Greek uppercase psi',
        latex: '\\Psi',
        text: 'Ψ',
    },
    {
        keywords: ['Omega'],
        descr: 'Greek uppercase omega',
        latex: '\\Omega',
        text: 'Ω',
    },
];

export const ALL_ENTRIES: LibraryEntryJS[] = [].concat(ALGEBRA, CALCULUS, FUNCTIONS, GREEK_SYMBOLS, LINEAR_ALGEBRA, TRIG);

export const latexToEntryMap = ALL_ENTRIES.reduce((map, entry) => {
    if (entry.latex) {
        map[entry.latex] = entry;
    }
    return map;
}, {}) as { [command: string]: LibraryEntryJS };
