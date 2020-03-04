---
title: Math Input State
---

The shape of a `MathInputState` object.

`hi, \math{x=\frac{1,2}}`

```ts
{
    content: [
        {
            type: 'block-level',
            data: {
                // styles applied to the entire block-level block
                style: {
                    font-family: 'Times',
                    font-size: 24,
                }
            },
            children: {
                content: [
                    {
                        type: 'block',
                        data: {
                            text: 'h'
                        }
                    },
                    {
                        type: 'block',
                        data: {
                            text: 'i'
                        }
                    },
                    {
                        type: 'block',
                        data: {
                            text: ','
                        }
                    },
                    {
                        type: 'block',
                        data: {
                            text: ' '
                        }
                    },
                    {
                        type: 'math',
                        children: {
                            root: [
                                {
                                    type: 'block',
                                    data: {
                                        text: 'x',
                                    }
                                },
                                {
                                    type: 'block',
                                    data: {
                                        text: '=',
                                    }
                                },
                                {
                                    type: 'fraction',
                                    children: {
                                        num: [
                                            {
                                                type: 'block,
                                                data: {
                                                    text: '1'
                                                }
                                            }
                                        ],
                                        denom: [
                                            {
                                                type: 'block,
                                                data: {
                                                    text: '2'
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },

                ]
            }
        }
    ],
    selection: {
        anchor: {
            block: '0.1:1',
            offset: 0,
        },
        focus: {
            block: '0.1:1',
            offset: 0,
        }
    },
    inlineStyles: [
        {
            start: '0.1:1',
            end: '0.1:2',
            style: {
                font-weight: 600,
            }
        }
    ]
}
```
