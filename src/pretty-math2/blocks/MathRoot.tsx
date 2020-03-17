import * as React from 'react';
import { Block } from '../model';

export interface MathRootBlockData {}
export type MathRootBlock = Block<MathRootBlockData>;

// const mathRoot = {
//     type: 'math:root',
//
//     printers: {
//         calchub: (root: MathRootBlock) => {
//             const content = root.getChild('content').toCalchub();
//             return `\\math{${content}`;
//         },
//         python: root => {
//         },
//     },
//
//     render: (root, editor) => {
//         return <span>Math root here</span>;
//     },
// };
