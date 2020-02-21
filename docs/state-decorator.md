---
title: State Decorator
description: Modifing the MathInputState object
---

The `StateDecorator` module takes a `MathInputState` object and *decorates* it with a host of convience methods. These convience methods help us modify the state object in some way. For example, we could remove all currently selected blocks, or move the cursor to the beginning of the line. The methods can also be chained together to perform more complex manipulations. Once finished, call the `serialize()` method to get a plain `MathInputState` object to pass into the `PrettyMathInput.inputState` prop.

## Usage

A very simple example of a `handleCommand` callback which moves the cursor to the end of the chain and then inserts the characters `foo` at the cursor position if the command is `insert_foo`.

```ts
import { decorateState } from 'pretty-math';

// some handler which is passed the inputState object
handleCommand: (command: string, inputState: InputState) => {
    const decorated = decorateState(inputState);
    
    if (command === 'insert_foo') {
        decorated
            .moveCursorToEndOfChain()
            .insertBlocks([
                {
                    type: 'block',
                    data: {
                        text: 'f'
                    }
                },
                {
                    type: 'block',
                    data: {
                        text: 'o'
                    }
                },
                {
                    type: 'block',
                    data: {
                        text: 'o'
                    }
                }
            ]);
    }

    this.setState({
        inputState: decorated.serialize(),
    });
}
```

## Getters

Getters help us understand the current state of the `PrettyMathInput` field.

### `blocks: Block[]`

### `selection.isCollapsed: boolean`

Whether the Selection is collapsed or not. When the selection is collapsed, it means there are no blocks selected.

### `selection.focus: CursorPosition`

The `CursorPosition` where the cursor is currently focused. This will be the same as `selection.anchor` when the cursor is collapsed.

### `selection.anchor: CursorPosition`

The `CursorPosition` where the cursor is currently anchored. This will be the same as `selection.focus` when the cursor is collapsed.

## Methods

### `serialize(): InputState`

Returns an `InputState` object that represents the current state.

### `insertBlocks(blocks: SerialBlock[]): void`

Injects the list of blocks at the current cursor position. See Blocks for information about `SerialBlock`.
