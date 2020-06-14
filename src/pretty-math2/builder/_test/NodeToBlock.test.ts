import { expect } from 'chai';
import { parseCalchub } from 'math';
import {
    Editor,
    blocksFromNodeTree,
} from 'pretty-math2/internal';

describe('NodeToBlock', () => {

    it('general', () => {
        [
            {
                root: {
                    type: 'root:math',
                    children: {
                        inner: [
                            {
                                type: 'atomic',
                                data: { text: 'a' }
                            },
                            {
                                type: 'end',
                            }
                        ]
                    }
                }
            },
            {
                root: {
                    type: 'root:math',
                    children: {
                        inner: [
                            {
                                type: 'atomic',
                                data: { text: 'a' }
                            },
                            {
                                type: 'atomic',
                                data: { text: 'b' }
                            },
                            {
                                type: 'end',
                            }
                        ]
                    }
                }
            },
            {
                root: {
                    type: 'root:math',
                    children: {
                        inner: [
                            {
                                type: 'atomic',
                                data: { text: 'a' }
                            },
                            {
                                type: 'atomic',
                                data: { text: '+' }
                            },
                            {
                                type: 'atomic',
                                data: { text: 'b' }
                            },
                            {
                                type: 'end',
                            }
                        ]
                    }
                }
            },
            {
                root: {
                    type: 'root:math',
                    children: {
                        inner: [
                            {
                                type: 'atomic',
                                data: { text: 'a' }
                            },
                            {
                                type: 'atomic',
                                data: { text: '+' }
                            },
                            {
                                type: 'end',
                            }
                        ]
                    }
                }
            },
            {
                root: {
                    type: "root:math",
                    children: {
                        inner: [
                            {
                                type: "math:radical",
                                children: {
                                    inner: [
                                        {
                                            type: "atomic",
                                            data: { text: "x" }
                                        },
                                        {
                                            type: "atomic",
                                            data: { text: "-" }
                                        },
                                        {
                                            type: "atomic",
                                            data: { text: "1" }
                                        },
                                        {
                                            type: "end"
                                        }
                                    ]
                                }
                            },
                            {
                                type: "end"
                            }
                        ]
                    }
                }
            },
            {
                root: {
                    type: "root:math",
                    children: {
                        inner: [
                            {
                                type: "math:derivative",
                                children: {
                                    wrt: [
                                        {
                                            type: "math:differential",
                                            data: { displayValue: "∂" },
                                            children: {
                                                inner: [
                                                    {
                                                        type: "atomic",
                                                        data: { text: "x" }
                                                    },
                                                    {
                                                        type: "end"
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            type: "end"
                                        }
                                    ],
                                    inner: [
                                        {
                                            type: "atomic",
                                            data: { text: "x" }
                                        },
                                        {
                                            type: "math:supsub",
                                            children: {
                                                sub: [],
                                                sup: [
                                                    {
                                                        type: "atomic",
                                                        data: { text: "2" }
                                                    },
                                                    {
                                                        type: "end"
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            type: "end"
                                        }
                                    ]
                                }
                            },
                            {
                                type: "end"
                            }
                        ]
                    }
                }
            },
            {
                root: {
                    type: "root:math",
                    children: {
                        inner: [
                            {
                                type: "atomic",
                                data: { text: "x" }
                            },
                            {
                                type: "math:supsub",
                                children: {
                                    sub: [
                                        {
                                            type: "atomic",
                                            data: { text: "t" }
                                        },
                                        {
                                            type: "end"
                                        }
                                    ],
                                    sup: []
                                }
                            },
                            {
                                type: "end"
                            }
                        ]
                    }
                }
            },
            {
                root: {
                    type: "root:math",
                    children: {
                        inner: [
                            {
                                type: "atomic",
                                data: { text: "x" }
                            },
                            {
                                type: "math:supsub",
                                children: {
                                    sub: [
                                        {
                                            type: "atomic",
                                            data: { text: "t" }
                                        },
                                        {
                                            type: "end"
                                        }
                                    ],
                                    sup: [
                                        {
                                            type: "atomic",
                                            data: { text: "2" }
                                        },
                                        {
                                            type: "end"
                                        }
                                    ]
                                }
                            },
                            {
                                type: "end"
                            }
                        ]
                    }
                }
            },
            {
                root: {
                    type: "root:math",
                    children: {
                        inner: [
                            {
                                type: "math:fraction",
                                children: {
                                    num: [
                                        {
                                            type: "atomic",
                                            data: { text: "x" }
                                        },
                                        {
                                            type: "end"
                                        }
                                    ],
                                    denom: [
                                        {
                                            type: "atomic",
                                            data: { text: "y" }
                                        },
                                        {
                                            type: "end"
                                        }
                                    ]
                                }
                            },
                            {
                                type: "end"
                            }
                        ]
                    }
                }
            }
        ].forEach(state => {
            const editor = Editor.createMathRoot(state);
            const parsed = parseCalchub(editor.root.toCalchub().text);
            const blocks = blocksFromNodeTree(parsed.root);
            const newEditor = Editor.createMathRoot();
            newEditor.inner.addBlocks(...blocks);
            expect(editor.root.serialize({ omitId: true })).to.deep.eq(newEditor.root.serialize({ omitId: true }));
        })
    });
});
