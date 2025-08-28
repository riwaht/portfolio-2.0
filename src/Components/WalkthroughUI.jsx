import React, { useEffect, useRef, useState } from 'react';
import steps from '../Utils/steps.json';

function WalkthroughUI({ currentStep, stepDescription, nextStep, prevStep, isTransitioning, events, completedEvents, exitWalkthrough }) {
    const [showPopup, setShowPopup] = useState(true);
    const [isFading, setIsFading] = useState(false);
    const popupPosition = steps[currentStep]?.popupPosition || { top: '30%', left: '50%' };
    const popupWidth = steps[currentStep]?.popupWidth || '30%';

    // References to the audio elements
    const nextSoundRef = useRef(null);
    const backSoundRef = useRef(null);

    // Show the popup when the step changes
    useEffect(() => {
        setShowPopup(true);
        setIsFading(false);
    }, [currentStep]);

    const playSound = (soundRef) => {
        if (soundRef.current) {
            soundRef.current.currentTime = 0; // Reset to start in case it's still playing
            soundRef.current.play();
            soundRef.current.volume = 0.1;
        }
    };

    const handleNext = () => {
        playSound(nextSoundRef); // Play the next button sound

        // Start the fade-out
        setIsFading(true);

        // Wait for the fade-out to complete before moving to the next step
        setTimeout(() => {
            nextStep();
        }, 500); // Match this duration to the CSS transition time (0.5s)
    };

    const handlePrev = () => {
        playSound(backSoundRef); // Play the back button sound

        // Start the fade-out
        setIsFading(true);

        // Wait for the fade-out to complete before moving to the previous step
        setTimeout(() => {
            prevStep();
        }, 500); // Match this duration to the CSS transition time (0.5s)
    };

    return (
        <>
            {/* Audio elements for sounds */}
            <audio ref={nextSoundRef} src="/Sounds/swoosh-next.wav" preload="auto"></audio>
            <audio ref={backSoundRef} src="/Sounds/swoosh-back.wav" preload="auto"></audio>

            {showPopup && (
                <div
                    className={`popup ${isFading ? 'hidden' : ''}`}
                    style={{ position: 'absolute', top: popupPosition.top, left: popupPosition.left, width: popupWidth }}
                >
                    <p>{stepDescription}</p>
                    <div className="navigation-buttons">
                        <button onClick={handlePrev} disabled={currentStep === 0 || isTransitioning}>
                            Back
                        </button>
                        {currentStep === steps.length - 1 ? (
                            <button onClick={exitWalkthrough} disabled={isTransitioning}>
                                Exit Walkthrough
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                disabled={
                                    currentStep === steps.length - 1 ||
                                    isTransitioning ||
                                    !Object.keys(events).every(event => completedEvents[event] === true)
                                }
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