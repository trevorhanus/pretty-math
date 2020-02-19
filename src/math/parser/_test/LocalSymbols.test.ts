import { expect } from 'chai';
import { parseCalchub, UC } from '../../internal';

describe('LocalSymbols', () => {
    
    it('function definition', () => {
        [
            {
                expr: '\\dfunc{f,x} = x^{2}',
                expected: {
                    op: '=',
                    left: {
                        op: '\\dfunc',
                        left: {
                            op: ',',
                            left: 'f',
                            right: 'loc:x',
                        },
                    },
                    right: {
                        op: '^',
                        left: 'loc:x',
                        right: '2',
                    }
                }
            },
            {
                expr: '\\dfunc{f,x,y} = x + y',
                expected: {
                    op: '=',
                    left: {
                        op: '\\dfunc',
                        left: {
                            op: ',',
                            left: 'f',
                            right: {
                                op: ',',
                                left: 'loc:x',
                                right: 'loc:y',
                            },
                        },
                    },
                    right: {
                        op: '+',
                        left: 'loc:x',
                        right: 'loc:y',
                    }
                }
            },
            {
                expr: '\\dfunc{f,x} = x + y',
                expected: {
                    op: '=',
                    left: {
                        op: '\\dfunc',
                        left: {
                            op: ',',
                            left: 'f',
                            right: 'loc:x',
                        },
                    },
                    right: {
                        op: '+',
                        left: 'loc:x',
                        right: 'y',
                    }
                }
            },
            {
                expr: '\\dfunc{f,\\alpha} = \\alpha + y',
                expected: {
                    op: '=',
                    left: {
                        op: '\\dfunc',
                        left: {
                            op: ',',
                            left: 'f',
                            right: 'loc:\\alpha',
                        },
                    },
                    right: {
                        op: '+',
                        left: 'loc:\\alpha',
                        right: 'y',
                    }
                }
            }
        ].forEach(test => {
            const { expr, expected } = test;
            const { root, tokens } = parseCalchub(expr);
            expect(root.only.toShorthand()).to.deep.eq(expected);
        });
    });

    it('derivative', () => {
        [
            {
                expr: '\\diff{x^{2},\\wrt{x}}',
                expected: {
                    op: '\\diff',
                    left: {
                        op: ',',
                        left: {
                            op: '^',
                            left: 'loc:x',
                            right: '2',
                        },
                        right:{
                            op: '\\wrt',
                            left: 'loc:x',
                        },
                    },
                }
            },
            {
                expr: '\\diff{x^{2},\\wrt{x}\\wrt{x}}',
                expected: {
                    op: '\\diff',
                    left: {
                        op: ',',
                        left: {
                            op: '^',
                            left: 'loc:x',
                            right: '2',
                        },
                        right: {
                            op: UC.ImplicitM,
                            left: {
                                op: '\\wrt',
                                left: 'loc:x',
                            },
                            right: {
                                op: '\\wrt',
                                left: 'loc:x',
                            }
                        },
                    }
                }
            },
            {
                expr: '\\diff{x^{2} + y, \\wrt{x}\\wrt{y}}',
                expected: {
                    op: '\\diff',
                    left: {
                        op: ',',
                        left: {
                            op: '+',
                            left: {
                                op: '^',
                                left: 'loc:x',
                                right: '2',
                            },
                            right: 'loc:y'
                        },
                        right: {
                            op: UC.ImplicitM,
                            left: {
                                op: '\\wrt',
                                left: 'loc:x',
                            },
                            right: {
                                op: '\\wrt',
                                left: 'loc:y',
                            }
                        },
                    },
                }
            },
        ].forEach(test => {
            const { expr, expected } = test;
            const { root, tokens } = parseCalchub(expr);
            expect(root.only.toShorthand()).to.deep.eq(expected);
        });
    });

    it('derivative in function', () => {
        [
            {
                expr: '\\dfunc{f, y} = \\diff{x + y, \\wrt{x}} + x',
                expected: {
                    op: '=',
                    left: {
                        op: '\\dfunc',
                        left: {
                            op: ',',
                            left: 'f',
                            right: 'loc:y',
                        },
                    },
                    right: {
                        op: '+',
                        left: {
                            op: '\\diff',
                            left: {
                                op: ',',
                                left: {
                                    op: '+',
                                    left: 'loc:x',
                                    right: 'loc:y',
                                },
                                right: {
                                    op: '\\wrt',
                                    left: 'loc:x'
                                }
                            }
                        },
                        right: 'x'
                    }
                }
            },
        ].forEach(test => {
            const { expr, expected } = test;
            const { root, tokens } = parseCalchub(expr);
            expect(root.only.toShorthand()).to.deep.eq(expected);
        });
    });
});
