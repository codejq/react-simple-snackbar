import { useCallback, useContext } from 'react'
import { SnackbarContext, defaultDuration, defaultPosition, positions } from './Snackbar'

// Custom hook to trigger the snackbar on function components
export const useSnackbar = ({
  position = defaultPosition,
  style = {},
  closeStyle = {},
} = {}) => {
  const { openSnackbar, closeSnackbar } = useContext(SnackbarContext)

  // Resolve position without mutating the parameter
  const resolvedPosition = positions.includes(position) ? position : defaultPosition

  const open = useCallback(
    (text = '', duration = defaultDuration, backgroundColor = null) => {
      // Spread into a new object instead of mutating the options style
      const resolvedStyle = backgroundColor ? { ...style, backgroundColor } : style
      openSnackbar(text, duration, resolvedPosition, resolvedStyle, closeStyle)
    },
    [openSnackbar, resolvedPosition, style, closeStyle]
  )

  // Returns methods in hooks array way
  return [open, closeSnackbar]
}
