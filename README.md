![](https://badgen.net/bundlephobia/minzip/svelte-useactions)

## About

This library is based on the [svelte-material-ui](https://github.com/hperrin/svelte-material-ui)
useActions implementation.

It enables you to use [actions](https://svelte.dev/docs#use_action) on custom components. Additionally you get type safety.

## Installation

```bash
npm i svelte-useactions

#or

yarn add svelte-useactions
```

## Basic Example

First create your component that accepts an array of actions.

```svelte
<!-- Input.svelte -->

<script lang="ts">
  import { useActions } from 'svelte-useactions';
  import type { ActionList } from 'svelte-useactions';

  export let use: ActionList<HTMLDivElement> = [];
</script>

<input use:useActions="{use}" />
```

Next define your action function

```ts
// autofocus.ts

export const autofocus: Action<HTMLInputElement> = (node) => {
  node.focus();
};
```

Now you can define actions for components.

```svelte
<!-- index.svelte -->

<script lang="ts">
  import { autofocus } from '$lib/autosize';
  import { createActionList } from 'svelte-useactions';
</script>

<input use={createActionList([[autofocus]])} />
```

You can also define parameters

```ts
// autofocus.ts

export const autofocus: Action<HTMLInputElement, string> = (node, text) => {
  node.focus();
  console.log(text);
};
```

```svelte
<!-- Other code... -->

<Input use={createActionList([[autofocus, "hey!"]])} />
```

## Note

`createActionList` is merely used for type-safety. If you don't care
about it you can just input a normal action list.

Example:

```svelte
<!-- Other code... -->

<Input use={[[autofocus, "hey!"]]} />
```

## API

### `useActions`

Used in tandem with the `use` directive. Accepts an [action list](#actionlist) as a parameter.

```svelte
<script lang="ts">
  import { useActions } from 'svelte-useactions';
  import type { Actions } from 'svelte-useactions';

  export let use: Actions<HTMLDivElement> = [];
</script>

<input use:useActions={use}
```

### `createActionList`

A wrapper function that provides better intellisense/type-checking.

Takes in an [action list](#actionlist)

```svelte
<!-- No parameters -->
<input use="{createActionList([[autofocus]])}" />

<!-- With parameters  -->
<Input use={createActionList([[autofocus, "hey!"]])} />

<!-- Multiple Actions-->
<Input use={createActionList([[autofocus], [anotherAction, {foo: "bar"}]])} />
```

### `ActionList`

An array of tuples where the first item is the action and optionally the
parameters of the action as the second item.

```ts
let actions: ActionList<HTMLDivElement> = [];
const duration = 500;

// With one action
actions = [[autofocus]];

// One action with parameters
actions = [[longpress, duration]];

// Multiple actions
actions = [[longpress, duration], [autofocus]];
```
