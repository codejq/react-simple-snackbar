import React from 'react'
import { render, screen, fireEvent, act, renderHook } from '@testing-library/react'
import SnackbarProvider, { useSnackbar } from '..'
import { defaultPosition, defaultDuration, defaultInterval } from '../Snackbar'

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
    jest.runOnlyPendingTimers()
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

    // setTimeout called with defaultDuration ms delay
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), defaultDuration)

    // Open snackbar with '' text
    expect(document.querySelector('.snackbar__text').textContent).toEqual('')

    // Position bottom-center on wrapper
    expect(document.querySelector('.snackbar-wrapper').className).toContain(
      `snackbar-wrapper-${defaultPosition}`
    )

    // No styles for snackbar and close button
    expect(document.querySelector('.snackbar').getAttribute('style')).toBeNull()
    expect(document.querySelector('.snackbar__close').getAttribute('style')).toBeNull()
  })

  it('should render snackbar with text', () => {
    const randomText = 'Some text to be rendered!'
    renderWithProvider(<ComponentMock text={randomText} />)

    fireEvent.click(screen.getByTestId('open'))

    expect(document.querySelector('.snackbar__text').textContent).toEqual(randomText)
  })

  it('should set a custom duration on open()', () => {
    renderWithProvider(<ComponentMock duration={3000} />)

    fireEvent.click(screen.getByTestId('open'))

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 3000)
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

    // Original style object must not be mutated
    expect(originalStyle).toEqual({ color: 'white' })
  })

  it('should close snackbar with close()', () => {
    renderWithProvider(<ComponentMock />)

    fireEvent.click(screen.getByTestId('open'))
    expect(document.querySelector('.snackbar')).not.toBeNull()

    fireEvent.click(screen.getByTestId('close'))

    // Advance past CSSTransition exit animation (150ms timeout)
    act(() => {
      jest.advanceTimersByTime(200)
    })

    expect(document.querySelector('.snackbar')).toBeNull()
  })

  it('should open and close snackbar after duration ends', () => {
    renderWithProvider(<ComponentMock />)

    fireEvent.click(screen.getByTestId('open'))
    expect(document.querySelector('.snackbar')).not.toBeNull()

    // Advance past duration + exit animation
    act(() => {
      jest.advanceTimersByTime(defaultDuration + 200)
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

    // Advance past exit animation and reopen interval
    act(() => {
      jest.advanceTimersByTime(defaultInterval + 200)
    })

    // Snackbar should be open again
    expect(document.querySelector('.snackbar')).not.toBeNull()

    // Advance past auto-close duration
    act(() => {
      jest.advanceTimersByTime(defaultDuration + 200)
    })

    expect(document.querySelector('.snackbar')).toBeNull()
  })
})
