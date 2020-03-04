---
title: Math Library
---

The `Library` is a collection of items available in math mode. These items are listed in the assistant when applicable.

```ts
interface LibraryItem {
    data?: any;
    description?: string;
    doSuggest?: () => boolean;
    keywords: string[];
    onSelect: (state: MathInputState) => void;
    preview?: string
    render?: RenderFn;
    tags?: string[];
}
```

### `data: any`

An optional arbitrary data object. This data will be available when rendering the item.

### `description?: string`

The description for 

### `doSuggest: (inputState: MathInputState) => boolean`

When set, this callback is invoked just before the item will be rendered in the Assistant's suggestion list. If the callback returns `false` the item will not appear in the suggestion list.

This is useful when you don't want to suggest specific items based on the state. For instance, Pretty Math uses this internally to not show the differential symbol, unless the cursor is in the denominator of a derivative block.

### `keywords: string[]`

A list of keywords that when typed, should make this item appear in the suggested list.

### `onSelect: (inputState: MathInputState) => void`

The callback that is invoked when the item is selected.

### `preview: string`


### `tags: string[]`

An optional list of tags. An item will show up under each tag in the full library. 
