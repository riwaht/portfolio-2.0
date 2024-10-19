import React, { useEffect, useState } from 'react';
import steps from '../Utils/steps.json';

function WalkthroughUI({ currentStep, stepDescription, nextStep, prevStep, isTransitioning, events, completedEvents, exitWalkthrough }) {
    const [showPopup, setShowPopup] = useState(true);
    // Get the popup position for the current step
    const popupPosition = steps[currentStep]?.popupPosition || { top: '30%', left: '50%' };
    const popupWidth = steps[currentStep]?.popupWidth || '30%';

    // Show the popup when the step changes
    useEffect(() => {
        setShowPopup(true);
    }, [currentStep]);

    return (
        <>
            {showPopup && (
                <div className="popup" style={{ position: 'absolute', top: popupPosition.top, left: popupPosition.left, width: popupWidth }}>
                    <p>{stepDescription}</p>
                    <div className="button">
                        <button onClick={prevStep} disabled={currentStep === 0 || isTransitioning}>
                            Back
                        </button>
                        {currentStep === steps.length - 1 ? (
                            <button
                                onClick={exitWalkthrough}
                                disabled={isTransitioning}
                            >
                                Exit Walkthrough
                            </button>
                        ) : (
                            <button
                                onClick={nextStep}
                                disabled={currentStep === steps.length - 1 || isTransitioning || !Object.keys(events).every(event => completedEvents[event] === true)}
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default WalkthroughUI;
