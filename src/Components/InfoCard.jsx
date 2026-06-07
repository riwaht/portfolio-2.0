import React from 'react';

// DOM overlay shown when a hotspot is focused. Reuses the themed `.popup`
// styling from the old walkthrough; positioning comes from `.house-infocard`.
function InfoCard({ interactable, onClose }) {
    if (!interactable) return null;

    return (
        <div className="house-infocard popup">
            <h3 className="house-infocard-title">{interactable.label}</h3>
            <p className="house-infocard-desc">{interactable.description}</p>
            <div className="navigation-buttons">
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default InfoCard;
