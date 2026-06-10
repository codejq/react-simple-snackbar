import React from 'react'
import './Footer.css'
import GitHubIcon from '../Icon/GitHubIcon'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>
          Created by{' '}
          <a href="https://github.com/codejq" target="blank">
            codejq
          </a>
          .
        </p>
        <a href="https://github.com/codejq/react-simple-snackbar" target="blank">
          <GitHubIcon />
        </a>
      </div>
    </footer>
  )
}
