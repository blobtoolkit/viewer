import React from 'react'
import { Link } from 'react-router-dom'
const Header = () => (
  <header>
    <nav>
      <ul>
        <li><Link to='/'>Home</Link></li>
      </ul>
    </nav>
  </header>
)

module.exports = Header;
