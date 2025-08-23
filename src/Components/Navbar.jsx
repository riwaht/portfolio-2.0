import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import '../styles.css';

function Navbar() {
    const location = useLocation();

    const navItems = [
        { path: '/', label: '< about />' },
        { path: '/projects', label: '< projects />' },
        { path: '/blog', label: '< blog />' },
        { path: '/house', label: '< experience />' }
    ];

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-logo">
                    <Link to="/">Riwa Hoteit</Link>
                </div>
                <div className="nav-right">
                    <ul className="nav-menu">
                        {navItems.map((item) => (
                            <li key={item.path} className="nav-item">
                                <Link 
                                    to={item.path} 
                                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <DarkModeToggle />
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
