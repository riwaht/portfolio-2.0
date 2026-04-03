import React, { useState } from 'react';
import DarkModeToggle from './DarkModeToggle';
import '../styles.css';

function Navbar({ onNavigationAttempt }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const currentPath = typeof window !== 'undefined' ? window.currentPath : '/';

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const navItems = [
        { path: '/', label: '< about />' },
        { path: '/projects', label: '< work />' },
        { path: '/journey', label: '< journey />' },
        { path: '/house', label: '< experience />' }
    ];

    const handleNavClick = (e, path) => {
        // If we're on the house page and there's a navigation attempt handler
        if (onNavigationAttempt && currentPath === '/house') {
            const canNavigate = onNavigationAttempt(path);
            if (!canNavigate) {
                e.preventDefault();
                return;
            }
        }
        
        // Don't navigate if we're already on the target page
        if (currentPath === path) {
            e.preventDefault();
            return;
        }
        
        // Navigate via standard link (Astro MPA)
        window.location.href = path;
        closeMobileMenu();
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-logo">
                    <span className="nav-logo-text">
                        Riwa Hoteit
                    </span>
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
                                    className={`nav-link nav-link-button ${currentPath === item.path ? 'active' : ''}`}
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
                <ul className="mobile-nav-menu">
                    {navItems.map((item) => (
                        <li key={item.path} className="mobile-nav-item">
                            <button
                                onClick={(e) => handleNavClick(e, item.path)}
                                className={`mobile-nav-link ${currentPath === item.path ? 'active' : ''}`}
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
