import { expect } from 'chai';
import { describe } from "mocha";
import { SerializedEditorState } from 'pretty-math/internal';

describe('Selection Range', () => {
    it.skip('TODO: Need to add Selection Range tests');
});

const TEST_STATE: SerializedEditorState = {
    root: {
        type: 'root:math',
        children: {
            inner: [
                {
                    type: 'math:function',
                    data: { displayValue: 'sin' },
                    children: {
                        inner: [
                            {
                                type: 'atomic',
                                data: { text: 't'}
                            },
                            {
                                type: 'atomic',
                                data: { text: '+'}
                            },
                            {
                                type: 'atomic',
                                data: { text: '2'}
                            },
                            {
                                type: 'end',
                            }
                        ]
                    }
                },
                {
                    type: 'atomic',
                    data: { text: '+' },
                },
                {
                    type: 'math:function',
                    data: { displayValue: 'cos' },
                    children: {
                        inner: [
                            {
                                type: 'atomic',
                                data: { text: 'r'}
                            },
                            {
                                type: 'atomic',
                                data: { text: '-'}
                            },
                            {
                                type: 'atomic',
                                data: { text: '3'}
                            },
                            {
                                type: 'end',
                            }
                        ]
                    }
                },
                {
                    type: 'end',
                }
            ]
        }
    }
}
