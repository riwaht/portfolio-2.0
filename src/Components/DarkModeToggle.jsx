import React, { useState, useEffect } from 'react';
import '../styles.css';

function DarkModeToggle() {
    // Seed from the attribute the inline <head> script set before paint, so the
    // button label is right on the first render (no "dark"→"light" flicker in dark mode).
    const [isDark, setIsDark] = useState(
        () => typeof document !== 'undefined'
            && document.documentElement.getAttribute('data-theme') === 'dark'
    );

    useEffect(() => {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            setIsDark(savedTheme === 'dark');
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (prefersDark) {
            setIsDark(true);
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = isDark ? 'light' : 'dark';
        setIsDark(!isDark);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            <span className="theme-icon">
                {isDark ? 'light' : 'dark'}
            </span>
        </button>
    );
}

export default DarkModeToggle;
