import React from 'react'
import { SnackbarContext, defaultDuration, defaultPosition, positions } from './Snackbar'

// High order Component to trigger the snackbar on class components
export function withSnackbar(
  WrappedComponent,
  { position = defaultPosition, style = {}, closeStyle = {} } = {}
) {
  // Resolve position at HoC creation time, not per-call, to avoid mutation
  const resolvedPosition = positions.includes(position) ? position : defaultPosition

  return class extends React.Component {
    static contextType = SnackbarContext

    constructor(props) {
      super(props)
      this.open = this.open.bind(this)
      this.close = this.close.bind(this)
    }

    open(text = '', duration = defaultDuration, backgroundColor = null) {
      const { openSnackbar } = this.context
      // Spread into a new object instead of mutating the options style
      const resolvedStyle = backgroundColor ? { ...style, backgroundColor } : style
      openSnackbar(text, duration, resolvedPosition, resolvedStyle, closeStyle)
    }

    close() {
      const { closeSnackbar } = this.context
      closeSnackbar()
    }

    render() {
      return (
        <WrappedComponent
          openSnackbar={this.open}
          closeSnackbar={this.close}
          {...this.props}
        />
      )
    }
  }
}
