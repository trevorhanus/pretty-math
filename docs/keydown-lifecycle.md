---
title: Lifecycle of a Keydown Event
---

A discussion of what happens when a key is pressed within the input.

**1. User presses a key**

**2. Key is bound to a command**

The key binding function determines what command should be executed. It returns the command name as a string. Here are some examples of the default key bindings.

Note: You can always override the default key bindings by using the `keyBindingFn` prop, see this [example]().

| Key Sequence | command | default behavior |
| --- | --- | --- |
| ⌘ + C | `copy` | Copy the content included in the selection to the clipboard. |
| ⌘ + V | `paste` | Paste the text or state from the clipboard and place it at the current cursor position. |
| C | `input` | Insert a block with value `C` at the current cursor position. |

**3. Execute the command**

The command that was returned from the key binding function is executed. This may be a custom handler if the `handleCommand` prop is set, or it may be the default handler. The handler function is responsible for setting the new `inputState`.

**4. New state is set**

The new state is passed to the `PrettyMathInput` component through the `inputState` prop which triggers a re-render.

**5. Render the blocks**

Each block is rendered. The blocks renderer functions can overridden by passing your own `blockRenderFn` callback.

**6. Render the Assistant**

The Assistant looks at the current state and determines if it should render, and if so, what items to show. You can override the default behavior by using the `getAssistantItems`, `renderAssistant`, and/or `renderAssistantItem` props.

## Example: Italicizing Selection on Key Sequence ⌘ + i

In this example we'll show you how to implement a custom command. This command is going to italicize the current selection when the user presses ⌘ + i.

```tsx
class MyMathInput extends React.Component {

    constructor(props: MyMathInputProps) {
        super(props);
        this.state = {
            inputState: PrettyMath.blankState(),
        };
    }

    render() {
        return (
            <PrettyMathInput
                handleCommand={this.myCommandHandler}
                inputState={this.state.inputState}
                keyBindingFn={this.myKeyBindingFn}
                onChange={this.handleChange}
            />
        )
    }

    handleChange = (inputState: InputState) => {
        this.setState({
            inputState,
        });
    }

    myKeyBindingFn = (e: React.KeyboardEvent) => {
        if (e.keyCode === 73 && e.metaKey) {
            return 'italics';
        }
        // returning nothing tells Pretty Math to 
        // do whatever default thing it would have done
    };

    myCommandHandler = (command: string, inputState: InputState) => {
        if (command === 'italics') {
            // use the decorateState helper to modify the state
            const newState = decorateState(inputState)
                .toggleInlineStyle({ fontStyle: 'italic' })
                .serialize();

            // set the new state
            this.setState({
                inputState: newState,
            });

            // return handled here to let Pretty Math know
            // we already handled the command and we don't
            // want it to do any more
            return 'handled'
        }
    };
}
```

You can define your own blocks

```ts
interface Block {
    type: string;
    data: any;
    childMap: ChildMap;
}
```

What does a block need?
- how to render 
    - we need to pass it a style object on render from any inline styles
    - also if it's pa
- arbitrary data object
- 
