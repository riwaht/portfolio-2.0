import React from 'react';
import '../styles.css'; // Import the CSS file for styles

const Loading = () => {
    return (
        <div className="loading-container">
            <h2>Loading 3D Model...</h2>
            <div className="loader"></div>
        </div>
    );
};

export default Loading;
