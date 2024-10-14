import React, { useEffect, useState } from 'react';
import steps from '../Utils/steps.json';

function WalkthroughUI({ currentStep, stepDescription, nextStep, prevStep, isTransitioning, completeEvent, events, completedEvents }) {
    const [showPopup, setShowPopup] = useState(true);

    // Show the popup when the step changes
    useEffect(() => {
        setShowPopup(true);
    }, [currentStep]);

    return (
        <>
            {showPopup && (
                <div className="popup">
                    <p>{stepDescription}</p>
                    <div className="button">
                        <button onClick={prevStep} disabled={currentStep === 0 || isTransitioning}>
                            Back
                        </button>
                        {Object.keys(events).length > 0 ? (
                            Object.keys(events).map((eventKey) => (
                                <button 
                                    key={eventKey} 
                                    onClick={() => completeEvent(eventKey)}
                                    disabled={completedEvents[eventKey]}
                                >
                                    Complete {eventKey}
                                </button>
                            ))
                        ) : (
                            <p>No events to complete for this step.</p>
                        )}
                        <button 
                            onClick={nextStep} 
                            disabled={currentStep === steps.length - 1 || isTransitioning || !Object.keys(events).every(event => completedEvents[event] === true)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default WalkthroughUI;
