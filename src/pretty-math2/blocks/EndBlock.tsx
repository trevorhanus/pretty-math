import classNames from 'classnames';
import React from 'react';
import { IBlockConfig } from '../interfaces';
import { Block } from '../model';
import { PrinterOutput } from '../utils/PrinterOutput';

export type EndBlock = Block<{}>;

export const endBlockConfig: IBlockConfig<EndBlock> = {
    type: 'end',

    render: ({ block }) => {
        const hideEndBlock = block.list.length > 1 || block.list.config.transparentEndBlock;

        const className = classNames(
            'block end-block',
            { 'end-block--transparent': hideEndBlock },
        );

        const content = () => {
            const char = hideEndBlock ? '\u200b' : 'a';
            return <span style={{ opacity: 0 }}>{char}</span>;
        };

        return <span className={className}>{content()}</span>
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
