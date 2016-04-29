import React from 'react'
import Navbar from './Navbar.jsx'

class Layout extends React.Component {
  render () {
    const content = this.props.children
    return (
      <div>
        <Navbar />
        {content}
      </div>
    )
  }
}

module.exports = Layout
