import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import '../styles.css';

function Navbar({ onNavigationAttempt }) {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { path: '/', label: '< about />' },
        { path: '/projects', label: '< projects />' },
        { path: '/blog', label: '< blog />' },
        { path: '/house', label: '< experience />' }
    ];

    const handleNavClick = (e, path) => {
        // If we're on the house page and there's a navigation attempt handler
        if (onNavigationAttempt && location.pathname === '/house') {
            const canNavigate = onNavigationAttempt(path);
            if (!canNavigate) {
                e.preventDefault();
                return;
            }
        }
        
        // Don't navigate if we're already on the target page
        if (location.pathname === path) {
            e.preventDefault();
            return;
        }
        
        // Allow normal navigation
        navigate(path);
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-logo">
                    <button
                        onClick={(e) => handleNavClick(e, '/')}
                        className="nav-logo-button"
                    >
                        Riwa Hoteit
                    </button>
                </div>
                <div className="nav-right">
                    <ul className="nav-menu">
                        {navItems.map((item) => (
                            <li key={item.path} className="nav-item">
                                {/* Use consistent button-based navigation for all pages */}
                                <button
                                    onClick={(e) => handleNavClick(e, item.path)}
                                    className={`nav-link nav-link-button ${location.pathname === item.path ? 'active' : ''}`}
                                >
                                    {item.label}
                                </button>
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
