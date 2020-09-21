import React from 'react'
import { Link, withRouter } from 'react-router-dom';
import { signOut, isAuthenticated } from '../auth';

const isActive = (history, path) => {
    // If history matches, return active color
    if (history.location.pathname === path) return { color: '#ff9900' }
    else return { color: '#ffffff' }
}

const Navbar = ({ history }) => {
    return (
        <ul className="nav nav-tabs bg-primary">
            {
                !isAuthenticated() &&
                // <> represent react fragments
                <>
                    <li className="nav-item">
                        <Link to='/signin' className='nav-link' style={isActive(history, '/signin')}>Sign In</Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/signup' className='nav-link' style={isActive(history, '/signup')}>Sign Up</Link>
                    </li>
                </>
            }
            {
                isAuthenticated() &&
                <>
                    <li className="nav-item">
                        <Link to='/' className='nav-link' style={isActive(history, '/')}>Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/users' className='nav-link' style={isActive(history, '/users')}>Users</Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/findpeople' className='nav-link' style={isActive(history, '/findpeople')}>
                            Find People
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to={`/user/${isAuthenticated().user._id}`} className='nav-link' style={isActive(history, `/user/${isAuthenticated().user._id}`)}>
                            {isAuthenticated().user.name}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <span className='nav-link' style={isActive(history, '/signup'), { cursor: 'pointer', color: 'white' }} onClick={() => signOut(() => history.push('/'))}>Sign Out</span>
                    </li>
                </>
            }
        </ul>
    )
}

// withRouter gives us access to props from router
export default withRouter(Navbar);