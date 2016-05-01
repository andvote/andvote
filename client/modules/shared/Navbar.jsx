import React from 'react'
import { Link } from 'react-router'

class Navbar extends React.Component {
  render () {
    return (
      <h1 style={{margin: 12}}><Link to='/'>&amp;Vote</Link></h1>
    )
  }
}

module.exports = Navbar
