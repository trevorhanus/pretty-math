import { expect } from 'chai';
import { ErrorCode, parseCalchub, Parser, ParseResult, Token, TokenName, UC } from '../../internal';

const {
    Add,
    Array: Arr,
    ArrayCloser: AClose,
    ArrayOpener: AOpen,
    Assign: Ass,
    Comma,
    Cos,
    Divide,
    Derivative: Der,
    Dfunc,
    Factorial: Fact,
    Frac,
    LeftCurlyParens: Lcp,
    LeftRoundParens: Lp,
    Literal: Lit,
    Multiply,
    Negate: Neg,
    Pi,
    Power: Pow,
    RightCurlyParens: Rcp,
    RightRoundParens: Rp,
    Space,
    Sin,
    Subtract: Sub,
    Symbol: Sym,
    UserDefinedFunc: Udf,
    Wrt,
} = TokenName;

describe('Parser', () => {

    it('precedence', () => {
        [
            {
                descr: 'times then divide',
                tokens: [[Sym, 'a'], [Multiply, '*'], [Sym, 'b'], [Divide, '/'], [Sym, 'c']],
                shorthand: {
                    op: '/',
                    left: {
                        op: '*',
                        left: 'a',
                        right: 'b',
                    },
                    right: 'c',
                }
            },
            {
                descr: 'divide then times: a / b * c',
                tokens: [[Sym, 'a'], [Divide, '/'], [Sym, 'b'], [Multiply, '*'], [Sym, 'c']],
                shorthand: {
                    op: '*',
                    left: {
                        op: '/',
                        left: 'a',
                        right: 'b',
                    },
                    right: 'c',
                },
            },
            {
                descr: 'divide, times, times: a / b * c * d',
                tokens: [[Sym, 'a'], [Divide, '/'], [Sym, 'b'], [Multiply, '*'], [Sym, 'c'], [Multiply, '*'], [Sym, 'd']],
                shorthand: {
                    op: '*',
                    left: {
                        op: '*',
                        left: {
                            op: '/',
                            left: 'a',
                            right: 'b',
                        },
                        right: 'c',
                    },
                    right: 'd',
                },
            },
            {
                descr: '- sin 6',
                tokens: [[Neg, '-'], [Sin, 'sin'], [Lit, '6']],
                shorthand: {
                    op: 'neg',
                    left: {
                        op: 'sin',
                        left: '6',
                    },
                }
            },
            {
                descr: 'sin - 6',
                tokens: [[Sin, 'sin'], [Neg, '-'], [Lit, '6']],
                shorthand: {
                    op: 'sin',
                    left: {
                        op: 'neg',
                        left: '6',
                    },
                }
            },
            {
                descr: '-a!',
                tokens: [[Neg, '-'], [Sym, 'a'], [Fact, '!']],
                shorthand: {
                    op: 'neg',
                    left: {
                        op: '!',
                        left: 'a',
                    },
                }
            },
            {
                descr: '2^a!',
                tokens: [[Lit, '2'], [Pow, '^'], [Sym, 'a'], [Fact, '!']],
                shorthand: {
                    op: '^',
                    left: '2',
                    right: {
                        op: '!',
                        left: 'a',
                    },
                }
            },
        ].forEach(test => {
            runTest(test);
        });
    });

    it('implicit multiplication', () => {
        [
            {
                descr: '[literal] [symbol] with space between: 4 a',
                tokens: [[Lit, '4'], [Space, ' '], [Sym, 'a']],
                shorthand: {
                    op: '\u229B',
                    left: '4',
                    right: 'a',
                },
            },
            {
                descr: '[literal] [symbol]: 4a',
                tokens: [[Lit, '4'], [Sym, 'a']],
                shorthand: {
                    op: '\u229B',
                    left:'4',
                    right: 'a',
                },
            },
            {
                descr: '[right parens] [literal]: (1+2)4',
                tokens: [[Lp, '('], [Lit, '1'], [Add, '+'], [Lit, '2'], [Rp, ')'], [Lit, '4']],
                shorthand: {
                    op: '\u229B',
                    left: {
                        op: '()',
                        left: {
                            op: '+',
                            left: '1',
                            right: '2'
                        }
                    },
                    right: '4',
                },
            },
            {
                descr: '[right parens] [symbol]: (2) x',
                tokens: [[Lp, '('], [Lit, '2'], [Rp, ')'], [Sym, 'x']],
                shorthand: {
                    op: '\u229B',
                    left: {
                        op: '()',
                        left: '2',
                    },
                    right: 'x',
                },
            },
            {
                descr: '[right parens] [left parens]: (1+2)(3+4)',
                tokens: [[Lp, '('], [Lit, '1'], [Add, '+'], [Lit, '2'], [Rp, ')'], [Lp, '('], [Lit, '3'], [Add, '+'], [Lit, '4'], [Rp, ')']],
                shorthand: {
                    op: '\u229B',
                    left: {
                        op: '()',
                        left: {
                            op: '+',
                            left: '1',
                            right: '2'
                        }
                    },
                    right: {
                        op: '()',
                        left: {
                            op: '+',
                            left: '3',
                            right: '4'
                        }
                    },
                },
            },
            {
                descr: '[literal] [left parens]: 2(3+4)',
                tokens: [[Lit, '2'], [Lp, '('], [Lit, '3'], [Add, '+'], [Lit, '4'], [Rp, ')']],
                shorthand: {
                    op: '\u229B',
                    left: '2',
                    right: {
                        op: '()',
                        left: {
                            op: '+',
                            left: '3',
                            right: '4'
                        }
                    },
                },
            },
            {
                descr: '[symbol] [left parens]: a(3+4)',
                tokens: [[Sym, 'a'], [Lp, '('], [Lit, '3'], [Add, '+'], [Lit, '4'], [Rp, ')']],
                shorthand: {
                    op: '\u229B',
                    left: 'a',
                    right: {
                        op: '()',
                        left: {
                            op: '+',
                            left: '3',
                            right: '4'
                        }
                    },
                },
            },
            {
                descr: '[literal] [function]: 5sin{2}',
                tokens: [[Lit, '5'], [Sin, 'sin'], [Lcp, '{'], [Lit, '2'], [Rcp, '}']],
                shorthand: {
                    op: '\u229B',
                    left: '5',
                    right: {
                        op: 'sin',
                        left: '2',
                    },
                },
            },
            {
                descr: '[literal] [constant]: 5\\pi',
                tokens: [[Lit, '5'], [Pi, 'pi']],
                shorthand: {
                    op: '\u229B',
                    left: '5',
                    right: 'pi'
                },
            },
            {
                descr: 'implicit multi with divide: 4a/',
                tokens: [[Lit, '4'], [Sym, 'a'], [Divide, '/'], [Lit, '2']],
                shorthand: {
                    op: '/',
                    left: {
                        op: '\u229B',
                        left: '4',
                        right: 'a',
                    },
                    right: '2',
                },
            },
            {
                descr: 'implicit multi with divide: 4a/',
                tokens: [[Lit, '4'], [Sym, 'a'], [Divide, '/']],
                shorthand: {
                    op: '/',
                    left: {
                        op: '\u229B',
                        left: '4',
                        right: 'a',
                    },
                    right: '?',
                },
            },
            {
                descr: 'implicit with multi: a*4a',
                tokens: [[Sym, 'a'], [Multiply, '*'], [Lit, '4'], [Sym, 'a']],
                shorthand: {
                    op: '*',
                    left: 'a',
                    right: {
                        op: '\u229B',
                        left: '4',
                        right: 'a',
                    },
                },
            },
            // TODO: how should we handle this?
            // {
            //     descr: 'implicit with power: 5^4a',
            //     tokens: [[Lit, '5'], [Pow, '^'], [Lit, '4'], [Sym, 'a']],
            //     shorthand: {
            //         op: '^',
            //         left: '5',
            //         right: {
            //             op: '\u229B',
            //             left: '4',
            //             right: 'a',
            //         },
            //     },
            // },
            {
                descr: 'no implicit with power: 5^4*a',
                tokens: [[Lit, '5'], [Pow, '^'], [Lit, '4'], [Multiply, '*'], [Sym, 'a']],
                shorthand: {
                    op: '*',
                    left: {
                        op: '^',
                        left: '5',
                        right: '4'
                    },
                    right: 'a',
                },
            },
            {
                descr: 'implicit mult in denom: /4a',
                tokens: [[Lit, '2'], [Divide, '/'], [Lit, '4'], [Sym, 'a']],
                shorthand: {
                    op: '/',
                    left: '2',
                    right: {
                        op: '\u229B',
                        left: '4',
                        right:'a',
                    },
                },
            },
            {
                descr: '[literal] [func]: 5f(x)',
                tokens: [[Lit, '5'], [Udf, 'f'], [Lp, '('], [Sym, 'x'], [Rp, ')']],
                shorthand: {
                    op: '\u229B',
                    left: '5',
                    right: {
                        op: 'udf:f',
                        left: {
                            op: '()',
                            left: 'x'
                        }
                    },
                },
            },
            {
                descr: '[symbol] [lcp]: f{x}',
                tokens: [[Sym, 'f'], [Lcp, '{'], [Sym, 'x'], [Rcp, '}']],
                shorthand: {
                    op: '\u229B',
                    left: 'f',
                    right: 'x',
                },
            },
            {
                descr: '\\sin{}\\sin{}: [right parens] [func]',
                tokens: [[Sin, 'sin'], [Lcp, '{'], [Rcp, '}'], [Sin, 'sin'], [Lcp, '{'], [Rcp, '}']],
                shorthand: {
                    op: '\u229B',
                    left: {
                        op: 'sin',
                        left: '?'
                    },
                    right: {
                        op: 'sin',
                        left: '?'
                    },
                },
            },
            {
                descr: '(a + 1)(b - 4): [right parens] [left parens]',
                tokens: [[Lp, '('], [Sym, 'a'], [Add, '+'], [Lit, '1'], [Rp, ')'], [Lp, '('], [Sym, 'b'], [Sub, '-'], [Lit, '4'], [Rp, ')']],
                shorthand: {
                    op: '\u229B',
                    left: {
                        op: '()',
                        left: {
                            op: '+',
                            left: 'a',
                            right: '1'
                        }
                    },
                    right: {
                        op: '()',
                        left: {
                            op: '-',
                            left: 'b',
                            right: '4',
                        }
                    },
                },
            },
            {
                descr: '[function] [minus] [function]',
                expr: '\\sin{a}-\\sin{x}',
                tokens: [[Sin, 'sin'], [Lcp, '{'], [Sym, 'a'], [Rcp, '}'], [Sub, '-'], [Sin, 'sin'], [Lcp, '{'], [Sym, 'x'], [Rcp, '}']],
                shorthand: {
                    op: '-',
                    left: {
                        op: 'sin',
                        left: 'a',
                    },
                    right: {
                        op: 'sin',
                        left: 'x',
                    }
                },
            },
            {
                descr: '[literal] [symbol] [power] [literal]',
                expr: '8x^{2}',
                tokens: [[Lit, '8'], [Sym, 'x'], [Pow, '^'], [Lcp, '{'], [Lit, '2'], [Rcp, '}']],
                shorthand: {
                    op: UC.ImplicitM,
                    left: '8',
                    right: {
                        op: '^',
                        left: 'x',
                        right: '2',
                    },
                },
            },
            {
                descr: 'explicit division',
                expr: '1 / 2a',
                tokens: [[Lit, '1'], [Divide, '/'], [Lit, '2'], [Sym, 'a']],
                shorthand: {
                    op: '/',
                    left: '1',
                    right: {
                        op: UC.ImplicitM,
                        left: '2',
                        right: 'a',
                    }
                },
            },
            {
                descr: 'explicit multiply',
                expr: 'a * 2a',
                tokens: [[Sym, 'a'], [Multiply, '*'], [Lit, '2'], [Sym, 'a']],
                shorthand: {
                    op: '*',
                    left: 'a',
                    right: {
                        op: UC.ImplicitM,
                        left: '2',
                        right: 'a',
                    }
                },
            },
        ].forEach(test => {
            runTest(test);
        });
    });

    it('commas', () => {
        [
            {
                descr: 'happy path',
                tokens: [[Lit, '2'], [Comma, ','], [Lit, '5'], [Comma, ','], [Lit, '0']],
                shorthand: {
                    op: ',',
                    left: '2',
                    right: {
                        op: ',',
                        left: '5',
                        right: '0'
                    },
                }
            }
        ].forEach(test => {
            runTest(test);
        });
    });

    it('associativity', () => {
        [
            {
                descr: '+ and * precedence no parens',
                tokens: [[Sym, 'x'], [Add, '+'], [Lit, '2'], [Multiply, '*'], [Sym, 'y']],
                shorthand: {
                    op: '+',
                    left: 'x',
                    right: {
                        op: '*',
                        left: '2',
                        right: 'y'
                    }
                },
            },
            {
                descr: '+ and * precedence with parens: (x + 2) * y',
                tokens: [[Lp, '('], [Sym, 'x'], [Add, '+'], [Lit, '2'], [Rp, ')'], [Multiply, '*'], [Sym, 'y']],
                shorthand: {
                    op: '*',
                    left: {
                        op: '()',
                        left: {
                            op: '+',
                            left: 'x',
                            right: '2'
                        }
                    },
                    right: 'y'
                },
            },
            {
                descr: 'unary operator: \\sin a + 2',
                tokens: [[Sin, 'sin'], [Sym, 'a'], [Add, '+'], [Lit, '2']],
                shorthand: {
                    op: '+',
                    left: {
                        op: 'sin',
                        left: 'a'
                    },
                    right: '2',
                },
            },
            {
                descr: 'unary operator: 1 + \\sin a * 2',
                tokens: [[Lit, '1'], [Add, '+'], [Sin, 'sin'], [Sym, 'a'], [Multiply, '*'], [Lit, '2']],
                shorthand: {
                    op: '+',
                    left: '1',
                    right: {
                        op: '*',
                        left: {
                            op: 'sin',
                            left: 'a'
                        },
                        right: '2',
                    }
                },
            },
            {
                descr: 'unary operator with parens: (1 + \\sin a) * 2',
                tokens: [[Lp, '('], [Lit, '1'], [Add, '+'], [Sin, 'sin'], [Sym, 'a'], [Rp, ')'], [Multiply, '*'], [Lit, '2']],
                shorthand: {
                    op: '*',
                    left: {
                        op: '()',
                        left: {
                            op: '+',
                            left: '1',
                            right: {
                                op: 'sin',
                                left: 'a'
                            }
                        }
                    },
                    right: '2',
                },
            },
            {
                descr: '2 binary ops with same precedence and right associativity: 2 ^ 3 ^ 4',
                tokens: [[Lit, '2'], [Pow, '^'], [Lit, '3'], [Pow, '^'], [Lit, '4']],
                shorthand: {
                    op: '^',
                    left: '2',
                    right: {
                        op: '^',
                        left: '3',
                        right: '4'
                    },
                },
            },
            {
                descr: 'binary op with same precedence and left associativity: 2 * 3 * 4',
                tokens: [[Lit, '2'], [Multiply, '*'], [Lit, '3'], [Multiply, '*'],[Lit, '4']],
                shorthand: {
                    op: '*',
                    left: {
                        op: '*',
                        left: '2',
                        right: '3',
                    },
                    right: '4',
                },
            },
            {
                descr: 'binary op with same precedence and left associativity: 2 - 3 + 4',
                tokens: [[Lit, '2'], [Sub, '-'], [Lit, '3'], [Add, '+'], [Lit, '4']],
                shorthand: {
                    op: '+',
                    left: {
                        op: '-',
                        left: '2',
                        right: '3',
                    },
                    right: '4',
                },
            },
            {
                descr: 'nested unary: \\sin \\cos a',
                tokens: [[Sin, 'sin'], [Cos, 'cos'], [Sym, 'a']],
                shorthand: {
                    op: 'sin',
                    left: {
                        op: 'cos',
                        left: 'a',
                    },
                },
            },
        ].forEach(test => {
            runTest(test);
        });
    });

    it('constants', () => {
        [
            {
                descr: 'treated as an operand',
                tokens: [[Pi, '\\pi'], [Add, '+'], [Lit, '5']],
                shorthand: {
                    op: '+',
                    left: '\\pi',
                    right: '5'
                }
            }
        ].forEach(test => {
            runTest(test);
        });
    });

    it('calculus', () => {
        [
            {
                descr: 'derivative: \\diff{x^2,\\wrt{x}}',
                tokens: [[Der, '\\diff'], [Lcp, '{'], [Sym, 'x'], [Pow, '^'], [Lit, '2'], [Comma, ','], [Wrt, '\\wrt'], [Lcp, '{'], [Sym, 'x'], [Rcp, '}'], [Rcp, '}']],
                shorthand: {
                    op: '\\diff',
                    left: {
                        op: ',',
                        left: {
                            op: '^',
                            left: 'loc:x',
                            right: '2',
                        },
                        right: {
                            op: '\\wrt',
                            left: 'loc:x',
                        },
                    },
                }
            }
        ].forEach(test => {
            runTest(test);
        });
    });

    it('arrays', () => {
        [
            {
                descr: 'array: [1,2]',
                tokens: [[AOpen, '['], [Lit, '1'], [Comma, ','], [Lit, '2'], [AClose, ']']],
                shorthand: {
                    op: '[]',
                    items: [
                        '1',
                        '2'
                    ]
                }
            },
            {
                descr: 'nested arrays: [[1,2],[3,4]]',
                tokens: [[AOpen, '['], [AOpen, '['], [Lit, '1'], [Comma, ','], [Lit, '2'], [AClose, ']'], [Comma, ','], [AOpen, '['], [Lit, '3'], [Comma, ','], [Lit, '4'], [AClose, ']'], [AClose, ']']],
                shorthand: {
                    op: '[]',
                    items: [
                        {
                            op: '[]',
                            items: ['1', '2']
                        },
                        {
                            op: '[]',
                            items: ['3', '4']
                        }
                    ]
                }
            }
        ].forEach(test => {
            runTest(test);
        });
    });

    it('minus sign', () => {
        [
            {
                descr: 'unary: [minus] [literal]: -1',
                tokens: [[Sub, '-'], [Lit, '1']],
                shorthand: {
                    op: 'neg',
                    left: '1'
                }
            },
            {
                descr: 'unary: [minus] [symbol]: -a',
                tokens: [[Sub, '-'], [Sym, 'a']],
                shorthand: {
                    op: 'neg',
                    left: 'a'
                }
            },
            {
                descr: '[minus] [symbol] [minus] [literal]: -a-1',
                tokens: [[Sub, '-'], [Sym, 'a'], [Sub, '-'], [Lit, '1']],
                shorthand: {
                    op: '-',
                    left: {
                        op: 'neg',
                        left: 'a'
                    },
                    right: '1'
                }
            },
            {
                descr: '[symbol] [minus] [minus] [literal]: a--1',
                tokens: [[Sym, 'a'], [Sub, '-'], [Sub, '-'], [Lit, '1']],
                shorthand: {
                    op: '-',
                    left: 'a',
                    right: {
                        op: 'neg',
                        left: '1'
                    },
                }
            },
            {
                descr: '[symbol] [power] [minus] [literal]: a^-1',
                tokens: [[Sym, 'a'], [Pow, '^'], [Sub, '-'], [Lit, '1']],
                shorthand: {
                    op: '^',
                    left: 'a',
                    right: {
                        op: 'neg',
                        left: '1'
                    },
                }
            },
            {
                descr: '[lp] [minus] [literal] [rp]: (-1)',
                tokens: [[Lp, '('], [Sub, '-'], [Lit, '1'], [Rp, ')']],
                shorthand: {
                    op: '()',
                    left: {
                        op: 'neg',
                        left: '1'
                    }
                }
            },
            {
                descr: '[minus] [lp] [literal] [rp]: -(1)',
                tokens: [[Sub, '-'], [Lp, '('], [Lit, '1'], [Rp, ')']],
                shorthand: {
                    op: 'neg',
                    left: {
                        op: '()',
                        left: '1'
                    }
                }
            },
            {
                descr: '[constant] [minus] [literal]: pi - 1',
                tokens: [[Pi, 'pi'], [Sub, '-'], [Lit, '1']],
                shorthand: {
                    op: '-',
                    left: 'pi',
                    right: '1'
                }
            },
            {
                descr: '-9/x^2',
                tokens: [[Sub, '-'], [Lit, '9'], [Divide, '/'], [Sym, 'x'], [Pow, '^'], [Lit, '2']],
                shorthand: {
                    op: '/',
                    left: {
                        op: 'neg',
                        left: '9'
                    },
                    right: {
                        op: '^',
                        left: 'x',
                        right: '2'
                    }
                }
            },
        ].forEach(test => {
            runTest(test);
        });
    });

    it('user defined functions', () => {
        [
            {
                descr: 'f(x)',
                tokens: [[Udf, 'f'], [Lp, '('], [Sym, 'x'], [Rp, ')']],
                shorthand: {
                    op: 'udf:f',
                    left: {
                        op: '()',
                        left: 'x'
                    }
                }
            },
            {
                descr: 'g(x,10)',
                tokens: [[Udf, 'g'], [Lp, '('], [Sym, 'x'], [Comma, ','], [Lit, '10'], [Rp, ')']],
                shorthand: {
                    op: 'udf:g',
                    left: {
                        op: '()',
                        left: {
                            op: ',',
                            left: 'x',
                            right: '10'
                        }
                    }
                }
            },
        ].forEach(test => {
            runTest(test);
        });
    });

    it('functions', () => {
        [
            {
                descr: '\\frac{1,2}',
                tokens: [[Frac, 'frac'], [Lcp, '{'], [Lit, '1'], [Comma, ','], [Lit, '2'], [Rcp, '}']],
                shorthand: {
                    op: 'frac',
                    left: {
                        op: ',',
                        left: '1',
                        right: '2',
                    }
                }
            },
        ].forEach(test => {
            runTest(test);
        });
    });

    it('bugs', () => {
        [
            {
                descr: '\\frac{1,2}',
                tokens: [[Frac, 'frac'], [Lcp, '{'], [Lit, '1'], [Comma, ','], [Lit, '2'], [Rcp, '}']],
                shorthand: {
                    op: 'frac',
                    left: {
                        op: ',',
                        left: '1',
                        right: '2',
                    }
                }
            },
            {
                descr: '\\dfunc{f,x}=x^{2}',
                tokens: [[Dfunc, 'dfunc'], [Lcp, '{'], [Sym, 'f'], [Comma, ','], [Sym, 'x'], [Rcp, '}'], [Ass, '='], [Sym, 'x'], [Pow, '^'], [Lcp, '{'], [Lit, '2'], [Rcp, '}']],
                shorthand: {
                    op: '=',
                    left: {
                        op: 'dfunc',
                        left: {
                            op: ',',
                            left: 'f',
                            right: 'loc:x'
                        }
                    },
                    right: {
                        op: '^',
                        left: 'loc:x',
                        right: '2',
                    }
                }
            },
            {
                descr: 'f{(5)}',
                tokens: [[Sym, 'f'], [Lcp, '{'], [Lp, '('], [Lit, '5'], [Rp, ')'], [Rcp, '}']],
                definedFns: ['f'],
                shorthand: {
                    op: 'udf:f',
                    left: {
                        op: '()',
                        left: '5'
                    }
                }
            },
            {
                descr: '= ...',
                tokens: [[Ass, '='], [Space, ' '], [Lit, '...']],
                shorthand: {
                    op: '=',
                    left: '?',
                    right: '...',
                }
            },
        ].forEach(test => {
            runTest(test);
        });
    });

    // TODO: how to handle invalid expressions and errors?
    xit('invalid exprs', () => {
        [
            {
                expr: '())',
                code: ErrorCode.Syntax,
                message: `Missing operand for '('.`,
            },
            {
                expr: '1 *',
                code: ErrorCode.Syntax,
                message: `Missing operand for '*'.`,
            },
            {
                expr: '\\sin( )',
                code: ErrorCode.Syntax,
                message: `Missing operand for '('.`,
            },
            {
                expr: ' ? ',
                code: ErrorCode.InvalidChar,
                message: `Unrecognized input '?'.`,
            },
            {
                expr: 'a 4',
                code: ErrorCode.Syntax,
                message: 'Invalid syntax.',
            },
            {
                expr: 'a = \\cos',
                code: ErrorCode.Syntax,
                message: `Missing operand for '\\cos'.`,
            }
        ].forEach(test => {
            const { expr, code, message } = test;
            const { error } = parseCalchub(expr);
            expect(error.message).to.eq(message);
        });
    });
});

function runTest(test: any): ParseResult {
    const { tokens, shorthand, descr } = test;
    const definedFns = test.definedFns || [];
    const list = buildTokenList(tokens as TokenArgs[]);
    const parser = new Parser();
    const parseResult = parser.parse({ error: null, tokens: list, input: '', warnings: [] }, definedFns);
    const { root } = parseResult;
    expect(root.only.toShorthand(), descr).to.deep.eq(shorthand);
    return parseResult;
}

type TokenArgs = [TokenName, string];

function buildTokenList(tokens: TokenArgs[]): Token[] {
    return tokens.map(args => {
        return new Token(...args);
    });
}
