import classNames from 'classnames';
import { Block, IBlockConfig, PrinterOutput } from 'pretty-math/internal';
import React from 'react';

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
