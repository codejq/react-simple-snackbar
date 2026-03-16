import React, { createContext, useCallback, useMemo, useReducer, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import styles from './Snackbar.css'

// Snackbar default values
export const defaultPosition = 'bottom-center'
export const defaultDuration = 8000
export const defaultInterval = 250
export const positions = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
]

// Context used by the hook useSnackbar() and HoC withSnackbar()
export const SnackbarContext = createContext(null)

const initialSnackState = {
  text: '',
  duration: defaultDuration,
  position: defaultPosition,
  customStyles: {},
  closeCustomStyles: {},
}

function snackbarReducer(state, action) {
  switch (action.type) {
    case 'OPEN':
      return {
        ...state,
        text: action.text,
        duration: action.duration,
        position: action.position,
        customStyles: action.customStyles,
        closeCustomStyles: action.closeCustomStyles,
      }
    default:
      return state
  }
}

export default function SnackbarProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [snackState, dispatch] = useReducer(snackbarReducer, initialSnackState)

  // Refs that don't trigger re-renders
  const timeoutIdRef = useRef(null)
  const nodeRef = useRef(null)

  // Mirror open in a ref so openSnackbar can read it without a stale closure.
  // openRef.current is updated on every render from state.
  const openRef = useRef(false)
  openRef.current = open

  const closeSnackbar = useCallback(() => {
    setOpen(false)
  }, [])

  const triggerSnackbar = useCallback((text, duration, position, customStyles, closeCustomStyles) => {
    dispatch({ type: 'OPEN', text, duration, position, customStyles, closeCustomStyles })
    setOpen(true)
  }, [])

  // Manages all the snackbar's opening process
  const openSnackbar = useCallback((text, duration, position, customStyles, closeCustomStyles) => {
    if (openRef.current === true) {
      // Dismiss the current snackbar then reopen after the exit animation interval
      setOpen(false)
      setTimeout(() => {
        triggerSnackbar(text, duration, position, customStyles, closeCustomStyles)
      }, defaultInterval)
    } else {
      triggerSnackbar(text, duration, position, customStyles, closeCustomStyles)
    }
  }, [triggerSnackbar])

  // Memoize context value so consumers only re-render when function references change
  const contextValue = useMemo(
    () => ({ openSnackbar, closeSnackbar }),
    [openSnackbar, closeSnackbar]
  )

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}

      {/* Renders Snackbar at the end of the page */}
      <CSSTransition
        nodeRef={nodeRef}
        in={open}
        timeout={150}
        mountOnEnter
        unmountOnExit
        // Sets timeout to close the snackbar after its duration
        onEnter={() => {
          clearTimeout(timeoutIdRef.current)
          timeoutIdRef.current = setTimeout(closeSnackbar, snackState.duration)
        }}
        // Sets custom classNames based on position
        className={`${styles['snackbar-wrapper']} ${
          styles[`snackbar-wrapper-${snackState.position}`]
        }`}
        classNames={{
          enter: `${styles['snackbar-enter']} ${styles[`snackbar-enter-${snackState.position}`]}`,
          enterActive: `${styles['snackbar-enter-active']} ${
            styles[`snackbar-enter-active-${snackState.position}`]
          }`,
          exitActive: `${styles['snackbar-exit-active']} ${
            styles[`snackbar-exit-active-${snackState.position}`]
          }`,
        }}
      >
        {/* nodeRef must be on the root DOM element that CSSTransition manages */}
        <div ref={nodeRef}>
          <div className={styles.snackbar} style={snackState.customStyles}>
            {/* Snackbar's text */}
            <div className={styles.snackbar__text}>{snackState.text}</div>

            {/* Snackbar's close button */}
            <button
              onClick={closeSnackbar}
              className={styles.snackbar__close}
              style={snackState.closeCustomStyles}
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      </CSSTransition>
    </SnackbarContext.Provider>
  )
}

// CloseIcon SVG is styled with font properties
const CloseIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 12 12">
    <path
      fill="currentColor"
      d="M11.73 1.58L7.31 6l4.42 4.42-1.06 1.06-4.42-4.42-4.42 4.42-1.06-1.06L5.19 6 .77 1.58 1.83.52l4.42 4.42L10.67.52z"
      fillRule="evenodd"
    />
  </svg>
)
