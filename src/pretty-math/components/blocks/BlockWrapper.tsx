import classNames from 'classnames';
import { cloneElementWithProps } from 'common';
import { inject, observer } from 'mobx-react';
import { EditableEngine, getTargetedSide, IBlock } from 'pretty-math/internal';
import * as React from 'react';

declare global {
    interface MouseEvent {
        blockData?: {
            block: IBlock;
            offset: number,
        }
    }
}

export interface IBlockWrapperProps {
    block: IBlock;
    children?: any;
    engine?: EditableEngine;
}

export const BlockWrapper = inject('engine')(observer((props: IBlockWrapperProps) => {
    const { block, children, engine } = props;
    const child = React.Children.only(children);

    const selected = engine.selection.includesBlock(block);

    const className = classNames(
        child.props.className,
        { selected },
        block.decor.className,
        { 'focused-token': engine.selection.isPartOfFocusedNode(block) },
    );

    const style = {
        ...block.decor.style,
        ...child.props.style,
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.nativeEvent.blockData) {
            // some child already handled it
            return;
        }

        const side = getTargetedSide(e, e.nativeEvent.target as HTMLSpanElement);

        if (side === -1) {
            // somehow out of bounds
            return;
        }

        e.nativeEvent.blockData = { block, offset: side };
    };

    const handleMouseEnter = (e: React.MouseEvent) => {
        // we used to be rendering the BlockErrorDialog here
    };

    const handleMouseLeave = (e: React.MouseEvent) => {
        // portals.hide('math_field_overlay');
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (e.buttons !== 1) {
            return;
        }

        if (e.nativeEvent.blockData) {
            // some child already handled it
            return;
        }

        const side = getTargetedSide(e, e.nativeEvent.target as HTMLSpanElement);

        if (side === -1) {
            // somehow out of bounds
            return;
        }

        e.nativeEvent.blockData = { block, offset: side };
    };

    const childProps = {
        className,
        style,
        ref: ref => block.ref = ref,
        onMouseDown: handleMouseDown,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onMouseMove: handleMouseMove,
    };

    return cloneElementWithProps(child, childProps);
}));
