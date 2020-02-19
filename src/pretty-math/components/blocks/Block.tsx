import classNames from 'classnames';
import { observer } from 'mobx-react';
import * as React from 'react';
import { IBlock } from 'pretty-math/internal';
import { BlockWrapper, Cursor } from 'pretty-math/components';

export interface IBlockProps {
    block: IBlock;
    style?: React.CSSProperties;
}

export const Block = observer((props: IBlockProps) => {
    const { block, style } = props;

    return (
        <>
            <Cursor block={block} offset={0} />
            <BlockWrapper block={block}>
                <span className="block" style={style}>
                    { block.decor.displayValueOverride || block.text }
                </span>
            </BlockWrapper>
            <Cursor block={block} offset={1} />
        </>
    );
});

export interface IStaticBlockProps {
    block: IBlock;
}

export const StaticBlock = observer((props: IStaticBlockProps) => {
     const { block } = props;
     const decor = block.decor;
     const classes = classNames(
         'block',
         decor.className,
     );

     return (
         <span
             className={classes}
             style={decor.style}
         >
            { decor.displayValueOverride || block.text }
        </span>
     );
});
