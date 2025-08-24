import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import '../styles.css';

function Navbar({ onNavigationAttempt }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

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
        // Close mobile menu after navigation
        closeMobileMenu();
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
                
                {/* Mobile Menu Button */}
                <button 
                    className="mobile-menu-toggle"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle mobile menu"
                >
                    <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}></span>
                    <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}></span>
                    <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}></span>
                </button>
                
                {/* Desktop Navigation */}
                <div className="nav-right desktop-nav">
                    <ul className="nav-menu">
                        {navItems.map((item) => (
                            <li key={item.path} className="nav-item">
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
            
            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={closeMobileMenu}></div>
            
            {/* Mobile Navigation Menu */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-header">
                    <button 
                        className="mobile-menu-close"
                        onClick={closeMobileMenu}
                        aria-label="Close mobile menu"
                    >
                        ×
                    </button>
                </div>
                <ul className="mobile-nav-menu">
                    {navItems.map((item) => (
                        <li key={item.path} className="mobile-nav-item">
                            <button
                                onClick={(e) => handleNavClick(e, item.path)}
                                className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="mobile-menu-footer">
                    <DarkModeToggle />
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
