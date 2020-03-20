import React from 'react';
import { IBlockConfig } from '../interfaces';
import { Block } from '../model';
import { PrinterOutput } from '../utils/PrinterOutput';

export type EndBlock = Block<{}>;

export const endBlockConfig: IBlockConfig<EndBlock> = {
    type: 'end',

    render: ({ block }) => {
        if (block.list.length === 1) {
            return (
                <span className="block blank">&#8203;</span>
            )
        }
        return (
            <span className="block">&#8203;</span>
        )
    },

    printers: {
        calchub: () => {
            return PrinterOutput.blank();
        },
        python: () => {
            return PrinterOutput.blank();
        }
    },

};
