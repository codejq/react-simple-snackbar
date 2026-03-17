<p align="center">
  <img src="./Logo.png" alt="React Simple Snackbar Logo">
</p>

<p align="center">
  <a
    href="https://www.npmjs.com/package/react-simple-snackbar"
    title="NPM Version"
    target="blank"
  >
    <img
      src="https://img.shields.io/npm/v/react-simple-snackbar"
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
  <a
    href="https://coveralls.io/github/codejq/react-simple-snackbar?branch=master"
    title="Coverage Status"
    target="blank"
  >
    <img
      src="https://coveralls.io/repos/github/codejq/react-simple-snackbar/badge.svg?branch=master"
      alt="Coverage Status"
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
      src="https://img.shields.io/npm/l/@testing-library/react-hooks.svg"
      alt="MIT License"
    />
  </a>
</p>

> **This is the actively maintained fork** of the original `react-simple-snackbar` by [@evandromacedo](https://github.com/evandromacedo). The original repository is no longer maintained.

You can check the [live demo](https://codejq.github.io/react-simple-snackbar/).

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

First, you need to wrap your application into a `SnackbarProvider`:

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

Then you can use both options on any descendant component:

#### 1. `useSnackbar()` hook on function components

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

#### 2. `withSnackbar()` HoC on class components

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

These methods are returned from `useSnackbar()` hook in array destructuring syntax:

```js noLines
const [openSnackbar, closeSnackbar] = useSnackbar()

// You can also give different names as you wish
const [open, close] = useSnackbar()
```

Or added as additional props on components wrapped in `withSnackbar()`:

```js noLines
const { openSnackbar, closeSnackbar } = this.props
```

#### `openSnackbar(node [, duration [, backgroundColor]])`

- **`node`**: the node you want to show into the Snackbar. It can be just `"Some string like showed on Basic Usage"`, or `<p>Some element you would <strong>like</strong> to show</p>`.

- **`duration`**: a number in milliseconds to set the duration of the Snackbar. The default value is `8000`.

- **`backgroundColor`**: an optional CSS color string to override the Snackbar's background color for this specific call. Equivalent to passing `style: { backgroundColor: '...' }` in the options object, but applied per-call. Takes precedence over the `style.backgroundColor` option.

```jsx
// Basic
openSnackbar('Hello!')

// With custom duration
openSnackbar('Hello!', 3000)

// With custom duration and background color
openSnackbar('Error occurred', 5000, '#e53935')
```

#### `closeSnackbar()`

This method is used if you want to close the Snackbar programmatically. It doesn't receive any params.

### Options

You can pass an options object to customize your Snackbar. This object can be passed either in `useSnackbar([options])` or as the second argument of `withSnackbar(Component [, options])`.

#### Position

- **`position`**: a custom position for your Snackbar. The default value is `bottom-center`.

| Value | Description |
| --- | --- |
| `top-left` | Top of viewport, left-aligned |
| `top-center` | Top of viewport, centered |
| `top-right` | Top of viewport, right-aligned |
| `bottom-left` | Bottom of viewport, left-aligned |
| `bottom-center` | Bottom of viewport, centered **(default)** |
| `bottom-right` | Bottom of viewport, right-aligned |

#### Styling

- **`style`**: a [style object](https://reactjs.org/docs/dom-elements.html#style) with `camelCased` properties and string values. These styles are applied to the Snackbar itself. Use `style.backgroundColor` to set a global background color for all calls.

- **`closeStyle`**: same as above, but the styles are applied to the close button. You can use font properties to style the `X` icon.

#### Full Example

```jsx noLines
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

> The snackbar itself is [already tested](https://github.com/codejq/react-simple-snackbar/tree/master/src/__tests__) and you don't have to worry about it.

To test components that use Snackbar functionalities, there are some approaches as described below. These examples use [Jest](https://jestjs.io/) and [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/).

### Testing components that use `useSnackbar()` hook

You can mock the implementation of `useSnackbar` to return an array containing `openSnackbar` and `closeSnackbar` as mocked functions:

<!-- prettier-ignore -->
```jsx
// Component.test.js
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import * as Snackbar from '@codejq/react-simple-snackbar'
import Component from './Component'

// Mocks the open and close functions
const openSnackbarMock = jest.fn()
const closeSnackbarMock = jest.fn()
jest.spyOn(Snackbar, 'useSnackbar').mockImplementation(() => [openSnackbarMock, closeSnackbarMock])

it('can test the openSnackbar and closeSnackbar functions', () => {
  const { getByRole } = render(<Component />)

  // Simulates click on some buttons that opens and closes the Snackbar
  fireEvent.click(getByRole('button', { name: /open/i }))
  fireEvent.click(getByRole('button', { name: /close/i }))

  // Some examples of how you can test the mocks
  expect(openSnackbarMock).toHaveBeenCalled()
  expect(openSnackbarMock).toHaveBeenCalledTimes(1)
  expect(openSnackbarMock).toHaveBeenCalledWith('This is the text of the Snackbar.')
  expect(closeSnackbarMock).toHaveBeenCalled()
  expect(closeSnackbarMock).toHaveBeenCalledTimes(1)
})
```

### Testing components wrapped in `withSnackbar()` HoC

To make it easier to test and not make use of `SnackbarProvider`, you can export your component in isolation as a named export, and as a default export wrapped in `withSnackbar()`:

```jsx
// Component.js

// (...)
// * Here goes all the component's code *
// (...)

// Named export for testing, and default export for using
export { Component }
export default withSnackbar(Component)
```

So you can get the component as a named import, then mock the `openSnackbar` and `closeSnackbar` functions as common props if you want:

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

  // Simulates click on some buttons that opens and closes the Snackbar
  fireEvent.click(getByRole('button', { name: /open/i }))
  fireEvent.click(getByRole('button', { name: /close/i }))

  // Some examples of how you can test the mocks
  expect(openSnackbarMock).toHaveBeenCalled()
  expect(openSnackbarMock).toHaveBeenCalledTimes(1)
  expect(openSnackbarMock).toHaveBeenCalledWith('This is the text of the Snackbar.')
  expect(closeSnackbarMock).toHaveBeenCalled()
  expect(closeSnackbarMock).toHaveBeenCalledTimes(1)
})
```

## Contributing

See [CONTRIBUTING](https://github.com/codejq/react-simple-snackbar/blob/master/CONTRIBUTING.md) for more information on how to get started.

## License

React Simple Snackbar is open source software [licensed as MIT](https://github.com/codejq/react-simple-snackbar/blob/master/LICENSE.md).
