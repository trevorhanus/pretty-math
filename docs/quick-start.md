---
title: Quick Start
---

## Using with webpack

Document how to install and use `pretty-math` with webpack.

## Requiring from a CDN

Document how you could use this by sourcing it from a CDN.

## Basic Usage

```tsx
import React from 'react';
import { PrettyMathInput, MathInputState } from 'pretty-math';

interface MyMathFieldState {
    inputState: MathInputState;
}

class MyMathField extends React.Component {

    constructor(props: MyMathFieldProps) {
        super(props);
        this.state = {
            inputState: MathInputState.blank(),
        }
    }

    render() {
        return (
            <PrettyMathInput
                inputState={this.state.inputState}
                onChange={this.handleChange}
            />
        )
    }

    handleChange = (inputState: MathInputState) => {
        this.setState({
            inputState,
        });
    }
}
```

This is the bare minimum that you would need to get started with a `PrettyMathInput` field, but the component is very customizable and flexible. On the next page, we'll discuss the props and how to customize the behavior and the look and feel of the input field.
