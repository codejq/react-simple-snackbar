import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import SnackbarProvider, { withSnackbar } from '..'
import { defaultPosition, defaultDuration, defaultInterval } from '../Snackbar'

// Exit animation timeout in ms (CSSTransition timeout.exit)
const EXIT_TIMEOUT = 220

class ComponentMock extends React.Component {
  render() {
    const { openSnackbar, closeSnackbar, text, duration } = this.props

    return (
      <div>
        <button data-testid="open" onClick={() => openSnackbar(text, duration)}>
          Open
        </button>
        <button data-testid="close" onClick={() => closeSnackbar()}>
          Close
        </button>
      </div>
    )
  }
}

const renderWithProvider = ({
  text = '',
  duration = undefined,
  snackbarProperties = {},
} = {}) => {
  const Component = withSnackbar(ComponentMock, snackbarProperties)
  return render(
    <SnackbarProvider>
      <Component text={text} duration={duration} />
    </SnackbarProvider>
  )
}

describe('withSnackbar()', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    // Wrap timer flush in act() to avoid React state-update warnings
    act(() => {
      jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
  })

  it('should render with default values when nothing is passed to neither withSnackbar() nor open()', () => {
    renderWithProvider()

    // No snackbar rendered before open()
    expect(document.querySelector('.snackbar')).toBeNull()

    fireEvent.click(screen.getByTestId('open'))

    // Open snackbar with '' text
    expect(document.querySelector('.snackbar__text').textContent).toEqual('')

    // Position class applied to wrapper
    expect(document.querySelector('.snackbar-wrapper').className).toContain(
      `snackbar-wrapper-${defaultPosition}`
    )

    // Snackbar has --snackbar-duration inline style; close button has no inline styles
    expect(document.querySelector('.snackbar').style.cssText).toBe(
      `--snackbar-duration: ${defaultDuration}ms;`
    )
    expect(document.querySelector('.snackbar__close').getAttribute('style')).toBeNull()

    // Advance past duration → closeSnackbar fires, React re-renders, exit timer scheduled
    act(() => {
      jest.advanceTimersByTime(defaultDuration + 50)
    })
    // Advance past exit animation → CSSTransition unmounts
    act(() => {
      jest.advanceTimersByTime(EXIT_TIMEOUT + 50)
    })
    expect(document.querySelector('.snackbar')).toBeNull()
  })

  it('should render snackbar with text', () => {
    const randomText = 'Some text to be rendered!'
    renderWithProvider({ text: randomText })

    fireEvent.click(screen.getByTestId('open'))

    expect(document.querySelector('.snackbar__text').textContent).toEqual(randomText)
  })

  it('should close snackbar after a custom duration', () => {
    const customDuration = 3000
    renderWithProvider({ duration: customDuration })

    fireEvent.click(screen.getByTestId('open'))
    expect(document.querySelector('.snackbar')).not.toBeNull()

    // Should still be open just before custom duration ends
    act(() => {
      jest.advanceTimersByTime(customDuration - 100)
    })
    expect(document.querySelector('.snackbar')).not.toBeNull()

    // Advance remaining duration → closeSnackbar fires, exit timer scheduled
    act(() => {
      jest.advanceTimersByTime(150)
    })
    // Advance past exit animation
    act(() => {
      jest.advanceTimersByTime(EXIT_TIMEOUT + 50)
    })
    expect(document.querySelector('.snackbar')).toBeNull()
  })

  it('should set position className when passed correctly', () => {
    const snackbarProperties = { position: 'top-left' }
    renderWithProvider({ snackbarProperties })

    fireEvent.click(screen.getByTestId('open'))

    expect(document.querySelector('.snackbar-wrapper').className).toContain(
      'snackbar-wrapper-top-left'
    )
  })

  it('should render default position className when passed incorrectly', () => {
    const snackbarProperties = { position: 'some-position-that-doesnt-exist' }
    renderWithProvider({ snackbarProperties })

    fireEvent.click(screen.getByTestId('open'))

    expect(document.querySelector('.snackbar-wrapper').className).toContain(
      `snackbar-wrapper-${defaultPosition}`
    )
  })

  it('should pass a custom style for snackbar and close button as props', () => {
    const snackbarProperties = {
      style: {
        color: 'green',
        border: '2px solid yellow',
        textAlign: 'center',
      },
      closeStyle: {
        color: 'red',
        fontSize: '18px',
      },
    }
    renderWithProvider({ snackbarProperties })

    fireEvent.click(screen.getByTestId('open'))

    expect(document.querySelector('.snackbar')).toHaveStyle(snackbarProperties.style)
    expect(document.querySelector('.snackbar__close')).toHaveStyle(snackbarProperties.closeStyle)
  })

  it('should set backgroundColor when passed as third argument to open()', () => {
    class ComponentWithBg extends React.Component {
      render() {
        const { openSnackbar } = this.props
        return (
          <button data-testid="open" onClick={() => openSnackbar('hello', defaultDuration, 'red')}>
            Open
          </button>
        )
      }
    }
    const Wrapped = withSnackbar(ComponentWithBg)
    render(
      <SnackbarProvider>
        <Wrapped />
      </SnackbarProvider>
    )

    fireEvent.click(screen.getByTestId('open'))

    expect(document.querySelector('.snackbar')).toHaveStyle({ backgroundColor: 'red' })
  })

  it('should not mutate the style object when backgroundColor is passed', () => {
    const originalStyle = { color: 'white' }

    class ComponentWithBg extends React.Component {
      render() {
        const { openSnackbar } = this.props
        return (
          <button data-testid="open" onClick={() => openSnackbar('hello', defaultDuration, 'blue')}>
            Open
          </button>
        )
      }
    }
    const Wrapped = withSnackbar(ComponentWithBg, { style: originalStyle })
    render(
      <SnackbarProvider>
        <Wrapped />
      </SnackbarProvider>
    )

    fireEvent.click(screen.getByTestId('open'))

    // Original style object must not be mutated
    expect(originalStyle).toEqual({ color: 'white' })
  })

  it('should close snackbar with close()', () => {
    renderWithProvider()

    fireEvent.click(screen.getByTestId('open'))
    expect(document.querySelector('.snackbar')).not.toBeNull()

    fireEvent.click(screen.getByTestId('close'))

    // Advance past CSSTransition exit animation
    act(() => {
      jest.advanceTimersByTime(EXIT_TIMEOUT + 50)
    })

    expect(document.querySelector('.snackbar')).toBeNull()
  })

  it('should open and close snackbar after duration ends', () => {
    renderWithProvider()

    fireEvent.click(screen.getByTestId('open'))
    expect(document.querySelector('.snackbar')).not.toBeNull()

    // Advance past duration → closeSnackbar fires, exit timer scheduled
    act(() => {
      jest.advanceTimersByTime(defaultDuration + 50)
    })
    // Advance past exit animation → unmount
    act(() => {
      jest.advanceTimersByTime(EXIT_TIMEOUT + 50)
    })

    expect(document.querySelector('.snackbar')).toBeNull()
  })

  it('should remove the current snackbar and apply a new one when open() is called again before duration ends', () => {
    renderWithProvider()

    const openButton = screen.getByTestId('open')

    fireEvent.click(openButton)
    expect(document.querySelector('.snackbar')).not.toBeNull()

    // Second open while still showing
    fireEvent.click(openButton)

    // Advance past reopen interval (new snackbar opens)
    act(() => {
      jest.advanceTimersByTime(defaultInterval + 50)
    })

    // Snackbar should be open again
    expect(document.querySelector('.snackbar')).not.toBeNull()

    // Advance past auto-close duration → closeSnackbar fires, exit timer scheduled
    act(() => {
      jest.advanceTimersByTime(defaultDuration + 50)
    })
    // Advance past exit animation → unmount
    act(() => {
      jest.advanceTimersByTime(EXIT_TIMEOUT + 50)
    })

    expect(document.querySelector('.snackbar')).toBeNull()
  })
})
