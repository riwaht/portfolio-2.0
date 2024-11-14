import React, { useEffect, useState } from 'react';
import steps from '../Utils/steps.json';

function WalkthroughUI({ currentStep, stepDescription, nextStep, prevStep, isTransitioning, events, completedEvents, exitWalkthrough }) {
    const [showPopup, setShowPopup] = useState(true);
    const [isFading, setIsFading] = useState(false);
    // Get the popup position for the current step
    const popupPosition = steps[currentStep]?.popupPosition || { top: '30%', left: '50%' };
    const popupWidth = steps[currentStep]?.popupWidth || '30%';

    // Show the popup when the step changes
    useEffect(() => {
        setShowPopup(true);
        setIsFading(false);
    }, [currentStep]);
    
    const handleNext = () => {
        // Start the fade-out
        setIsFading(true);

        // Wait for the fade-out to complete before moving to the next step
        setTimeout(() => {
            nextStep(); // Move to the next step
        }, 500); // Match this duration to the CSS transition time (0.5s)
    };

    const handlePrev = () => {
        // Start the fade-out
        setIsFading(true);

        // Wait for the fade-out to complete before moving to the previous step
        setTimeout(() => {
            prevStep(); // Move to the previous step
        }, 500); // Match this duration to the CSS transition time (0.5s)
    }

        return (
            <>
                {showPopup && (
                    <div className={`popup ${isFading ? 'hidden' : ''}`} style={{ position: 'absolute', top: popupPosition.top, left: popupPosition.left, width: popupWidth }}>
                        <p>{stepDescription}</p>
                        <div className="button">
                            <button onClick={handlePrev} disabled={currentStep === 0 || isTransitioning}>
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
                                    onClick={handleNext}
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
