import React from 'react'
import { Link, withRouter } from 'react-router-dom'

const isActive = (history, path) => {
    // If history matches, return active color
    if (history.location.pathname === path) return { color: '#ff9900' }
        else return { color: '#ffffff' }
}

const Navbar = ({ history }) => {
    return (
        <ul className="nav nav-tabs bg-primary">
            <li className="nav-item">
                <Link className='nav-link' style={isActive(history, '/')} to='/'>Home</Link>
            </li>
            <li className="nav-item">
                <Link className='nav-link' style={isActive(history, '/signin')} to='/signin'>Sign In</Link>
            </li>
            <li className="nav-item">
                <Link className='nav-link' style={isActive(history, '/signup')} to='/signup'>Sign Up</Link>
            </li>
        </ul>
    )
}

// withRouter gives us access to props from router
export default withRouter(Navbar);