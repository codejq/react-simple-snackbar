import React from 'react'
import { render, screen, fireEvent, act, renderHook } from '@testing-library/react'
import SnackbarProvider, { useSnackbar } from '..'
import { defaultPosition, defaultDuration, defaultInterval } from '../Snackbar'

// Exit animation timeout in ms (CSSTransition timeout.exit)
const EXIT_TIMEOUT = 220

const ComponentMock = ({
  text = '',
  duration = undefined,
  snackbarProperties = {},
} = {}) => {
  const [open, close] = useSnackbar(snackbarProperties)

  return (
    <div>
      <button data-testid="open" onClick={() => open(text, duration)}>
        Open
      </button>
      <button data-testid="close" onClick={() => close()}>
        Close
      </button>
    </div>
  )
}

const renderWithProvider = (component) => {
  return render(<SnackbarProvider>{component}</SnackbarProvider>)
}

describe('useSnackbar()', () => {
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

  it('should return 2 functions in array on useSnackbar()', () => {
    const wrapper = ({ children }) => <SnackbarProvider>{children}</SnackbarProvider>
    const { result } = renderHook(() => useSnackbar(), { wrapper })
    const [open, close] = result.current
    expect(open).toBeInstanceOf(Function)
    expect(close).toBeInstanceOf(Function)
  })

  it('should render with default values when nothing is passed to neither useSnackbar() nor open()', () => {
    renderWithProvider(<ComponentMock />)

    // No snackbar rendered before open()
    expect(document.querySelector('.snackbar')).toBeNull()

    // Simulates open()
    fireEvent.click(screen.getByTestId('open'))

    // Open snackbar with '' text
    expect(document.querySelector('.snackbar__text').textContent).toEqual('')

    // Position class applied to wrapper
    expect(document.querySelector('.snackbar-wrapper').className).toContain(
      `snackbar-wrapper-${defaultPosition}`
    )

    // No inline styles for snackbar and close button
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
    renderWithProvider(<ComponentMock text={randomText} />)

    fireEvent.click(screen.getByTestId('open'))

    expect(document.querySelector('.snackbar__text').textContent).toEqual(randomText)
  })

  it('should close snackbar after a custom duration', () => {
    const customDuration = 3000
    renderWithProvider(<ComponentMock duration={customDuration} />)

    fireEvent.click(screen.getByTestId('open'))
    expect(document.querySelector('.snackbar')).not.toBeNull()

    // Should still be open just before custom duration ends
    act(() => {
      jest.advanceTimersByTime(customDuration - 100)
    })
    expect(document.querySelector('.snackbar')).not.toBeNull()

    // Should be closed after custom duration — advance remaining 100ms + buffer
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
    renderWithProvider(<ComponentMock snackbarProperties={snackbarProperties} />)

    fireEvent.click(screen.getByTestId('open'))

    expect(document.querySelector('.snackbar-wrapper').className).toContain(
      'snackbar-wrapper-top-left'
    )
  })

  it('should render default position className when passed incorrectly', () => {
    const snackbarProperties = { position: 'some-position-that-doesnt-exist' }
    renderWithProvider(<ComponentMock snackbarProperties={snackbarProperties} />)

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
    renderWithProvider(<ComponentMock snackbarProperties={snackbarProperties} />)

    fireEvent.click(screen.getByTestId('open'))

    expect(document.querySelector('.snackbar')).toHaveStyle(snackbarProperties.style)
    expect(document.querySelector('.snackbar__close')).toHaveStyle(snackbarProperties.closeStyle)
  })

  it('should set backgroundColor when passed as third argument to open()', () => {
    const ComponentWithBg = () => {
      const [open] = useSnackbar()
      return (
        <button data-testid="open" onClick={() => open('hello', defaultDuration, 'red')}>
          Open
        </button>
      )
    }
    renderWithProvider(<ComponentWithBg />)

    fireEvent.click(screen.getByTestId('open'))

    expect(document.querySelector('.snackbar')).toHaveStyle({ backgroundColor: 'red' })
  })

  it('should not mutate the style object when backgroundColor is passed', () => {
    const originalStyle = { color: 'white' }
    const ComponentWithBg = () => {
      const [open] = useSnackbar({ style: originalStyle })
      return (
        <button data-testid="open" onClick={() => open('hello', defaultDuration, 'blue')}>
          Open
        </button>
      )
    }
    renderWithProvider(<ComponentWithBg />)

    fireEvent.click(screen.getByTestId('open'))

    expect(originalStyle).toEqual({ color: 'white' })
  })

  it('should close snackbar with close()', () => {
    renderWithProvider(<ComponentMock />)

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
    renderWithProvider(<ComponentMock />)

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
    renderWithProvider(<ComponentMock />)

    const openButton = screen.getByTestId('open')

    fireEvent.click(openButton)
    expect(document.querySelector('.snackbar')).not.toBeNull()

    // Second open while still showing
    fireEvent.click(openButton)

    // Advance past reopen interval (setOpen(false) already fired, this opens the new snackbar)
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
