import React from 'react';
import { IBlockConfig } from '../interfaces';
import { Block } from '../model';
import { PrinterOutput } from '../utils/PrinterOutput';

export type BlankBlock = Block<{}>;

export const blankBlockConfig: IBlockConfig<BlankBlock> = {
    type: 'blank',

    render: () => {
        return (
            <span className="block blank"/>
        );
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
