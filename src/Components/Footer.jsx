import React from 'react';
import '../styles.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="social-links">
                    <a 
                        href="#" 
                        className="social-icon" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        title="Reddit"
                    >
                        <i className="fab fa-reddit"></i>
                    </a>
                    <a 
                        href="#" 
                        className="social-icon" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        title="LinkedIn"
                    >
                        <i className="fab fa-linkedin"></i>
                    </a>
                    <a 
                        href="#" 
                        className="social-icon" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        title="Instagram"
                    >
                        <i className="fab fa-instagram"></i>
                    </a>
                </div>
                <p className="footer-text">© 2025 Riwa Hoteit. Computer Engineering student passionate about developer platforms, APIs, and scalable infrastructure.</p>
            </div>
        </footer>
    );
}

export default Footer;
