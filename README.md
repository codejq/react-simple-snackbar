<p align="center">
  <img src="./Logo.png" alt="React Simple Snackbar Logo">
</p>

<p align="center">
  <a
    href="https://www.npmjs.com/package/@codejq/react-simple-snackbar"
    title="NPM Version"
    target="blank"
  >
    <img
      src="https://img.shields.io/npm/v/@codejq/react-simple-snackbar"
      alt="NPM Version"
    />
  </a>
  <a
    href="https://github.com/codejq/react-simple-snackbar/actions/workflows/npm-publish.yml"
    title="CI Status"
    target="blank"
  >
    <img
      src="https://github.com/codejq/react-simple-snackbar/actions/workflows/npm-publish.yml/badge.svg"
      alt="CI Status"
    />
  </a>
  <a href="#" title="Gzipped size">
    <img
      src="https://img.badgesize.io/codejq/react-simple-snackbar/master/dist/index.js.svg?compression=gzip"
      alt="Gzipped size"
    />
  </a>
  <a href="https://standardjs.com" title="JavaScript Style Guide" target="blank">
    <img
      src="https://img.shields.io/badge/code_style-standard-brightgreen.svg"
      alt="JavaScript Style Guide"
    />
  </a>
  <a
    href="https://github.com/codejq/react-simple-snackbar/blob/master/LICENSE.md"
    title="MIT License"
    target="blank"
  >
    <img
      src="https://img.shields.io/npm/l/@codejq/react-simple-snackbar.svg"
      alt="MIT License"
    />
  </a>
</p>

> **This is the actively maintained fork** of the original `react-simple-snackbar` by [@evandromacedo](https://github.com/evandromacedo). The original repository is no longer maintained. This fork adds React 16.8–19 support, a modernized UI, new positions, per-call background color, and automated publishing.

## Live Demo

**[codejq.github.io/react-simple-snackbar](https://codejq.github.io/react-simple-snackbar/)**

The demo page lets you interactively try every position, custom color, custom duration, and styling option in real time.

## Getting Started

### Requirements

Requires **React 16.8 or later**. Compatible with React 16.8 through React 19.

### Installation

```sh
npm install --save @codejq/react-simple-snackbar
```

or

```sh
yarn add @codejq/react-simple-snackbar
```

### Basic Usage

First, wrap your application in a `SnackbarProvider`:

```jsx
// App.js
import React from 'react'
import SnackbarProvider from '@codejq/react-simple-snackbar'
import SomeChildComponent from './SomeChildComponent'

export default function App() {
  return (
    <SnackbarProvider>
      <SomeChildComponent />
    </SnackbarProvider>
  )
}
```

Then use it in any descendant component:

#### 1. `useSnackbar()` hook (function components)

<!-- prettier-ignore -->
```jsx
// SomeChildComponent.js
import React from 'react'
import { useSnackbar } from '@codejq/react-simple-snackbar'

export default function SomeChildComponent() {
  const [openSnackbar, closeSnackbar] = useSnackbar()

  return (
    <div>
      <button onClick={() => openSnackbar('This is the content of the Snackbar.')}>
        Click me to open the Snackbar!
      </button>
      <button onClick={closeSnackbar}>
        Click me to close the Snackbar programmatically.
      </button>
    </div>
  )
}
```

#### 2. `withSnackbar()` HoC (class components)

<!-- prettier-ignore -->
```jsx
// SomeChildComponent.js
import React from 'react'
import { withSnackbar } from '@codejq/react-simple-snackbar'

class SomeChildComponent extends React.Component {
  render() {
    const { openSnackbar, closeSnackbar } = this.props

    return (
      <div>
        <button onClick={() => openSnackbar('This is the content of the Snackbar.')}>
          Click me to open the Snackbar!
        </button>
        <button onClick={closeSnackbar}>
          Click me to close the Snackbar programmatically.
        </button>
      </div>
    )
  }
}

export default withSnackbar(SomeChildComponent)
```

## API

### Methods

```js
const [openSnackbar, closeSnackbar] = useSnackbar()

// You can also give different names as you wish
const [open, close] = useSnackbar()
```

Or as props on components wrapped in `withSnackbar()`:

```js
const { openSnackbar, closeSnackbar } = this.props
```

#### `openSnackbar(node [, duration [, backgroundColor]])`

- **`node`**: the content to show. Can be a string or any React node: `'Hello!'` or `<p>Some <strong>rich</strong> text</p>`.

- **`duration`**: milliseconds before auto-close. Default: `6000`.

- **`backgroundColor`**: optional CSS color string to override the background color for this specific call. Takes precedence over the `style.backgroundColor` option.

```jsx
// Basic
openSnackbar('Hello!')

// With custom duration
openSnackbar('Hello!', 3000)

// With custom duration and background color
openSnackbar('Error occurred', 5000, '#e53935')

// Success green
openSnackbar('Saved!', 4000, '#22c55e')
```

#### `closeSnackbar()`

Closes the snackbar programmatically. Takes no arguments.

### Options

Pass an options object to `useSnackbar([options])` or as the second argument to `withSnackbar(Component [, options])`.

#### Position

- **`position`**: where the snackbar appears. Default: `center`.

| Value | Description |
| --- | --- |
| `center` | True viewport center — scale-in animation **(default)** |
| `top-left` | Top of viewport, left-aligned |
| `top-center` | Top of viewport, centered |
| `top-right` | Top of viewport, right-aligned |
| `bottom-left` | Bottom of viewport, left-aligned |
| `bottom-center` | Bottom of viewport, centered |
| `bottom-right` | Bottom of viewport, right-aligned |

#### Styling

- **`style`**: a [style object](https://reactjs.org/docs/dom-elements.html#style) with `camelCased` properties applied to the snackbar. Use `style.backgroundColor` to set a global background color.

- **`closeStyle`**: same as above, applied to the close button.

#### Full Example

```jsx
const options = {
  position: 'bottom-right',
  style: {
    backgroundColor: 'midnightblue',
    border: '2px solid lightgreen',
    color: 'lightblue',
    fontFamily: 'Menlo, monospace',
    fontSize: '20px',
    textAlign: 'center',
  },
  closeStyle: {
    color: 'lightcoral',
    fontSize: '16px',
  },
}

// Usage with hooks
const [openSnackbar] = useSnackbar(options)
openSnackbar('Styled message!')

// Override background color for a specific call
openSnackbar('Error!', 5000, '#e53935')

// Usage with HoC
withSnackbar(Component, options)
```

## Testing

> The snackbar itself is [already tested](https://github.com/codejq/react-simple-snackbar/tree/master/src/__tests__) — you don't need to worry about it.

### Testing components that use `useSnackbar()`

```jsx
// Component.test.js
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import * as Snackbar from '@codejq/react-simple-snackbar'
import Component from './Component'

const openSnackbarMock = jest.fn()
const closeSnackbarMock = jest.fn()
jest.spyOn(Snackbar, 'useSnackbar').mockImplementation(() => [openSnackbarMock, closeSnackbarMock])

it('can test the openSnackbar and closeSnackbar functions', () => {
  const { getByRole } = render(<Component />)

  fireEvent.click(getByRole('button', { name: /open/i }))
  fireEvent.click(getByRole('button', { name: /close/i }))

  expect(openSnackbarMock).toHaveBeenCalledTimes(1)
  expect(openSnackbarMock).toHaveBeenCalledWith('This is the text of the Snackbar.')
  expect(closeSnackbarMock).toHaveBeenCalledTimes(1)
})
```

### Testing components wrapped in `withSnackbar()`

Export the component as both a named export (for testing) and a default export (wrapped):

```jsx
// Component.js
export { Component }
export default withSnackbar(Component)
```

Then in tests, import the unwrapped component and pass mock props:

```jsx
// Component.test.js
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Component } from './Component'

it('can test the openSnackbar and closeSnackbar functions', () => {
  const openSnackbarMock = jest.fn()
  const closeSnackbarMock = jest.fn()
  const { getByRole } = render(
    <Component openSnackbar={openSnackbarMock} closeSnackbar={closeSnackbarMock} />
  )

  fireEvent.click(getByRole('button', { name: /open/i }))
  fireEvent.click(getByRole('button', { name: /close/i }))

  expect(openSnackbarMock).toHaveBeenCalledTimes(1)
  expect(closeSnackbarMock).toHaveBeenCalledTimes(1)
})
```

## Contributing

See [CONTRIBUTING](https://github.com/codejq/react-simple-snackbar/blob/master/CONTRIBUTING.md) for more information on how to get started.

## License

React Simple Snackbar is open source software [licensed as MIT](https://github.com/codejq/react-simple-snackbar/blob/master/LICENSE.md).
