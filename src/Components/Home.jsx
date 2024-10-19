import React, { Suspense, useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import LightingWalkthrough from './LightingWalkthrough';
import Lighting from './Lighting';
import ModelController from '../Controllers/ModelController';
import '../styles.css';
import steps from '../Utils/steps.json';
import WalkthroughUI from './WalkthroughUI';
import WalkthroughController from '../Controllers/WalkthroughController';
import Loading from '../Utils/Loading'; // Import the Loading component
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from "@vercel/analytics/react"
import * as THREE from 'three';
import { SoftShadows } from '@react-three/drei';

function Home() {
    const modelRef = useRef();
    const Model = React.lazy(() => import('./Model'));
    const [currentStep, setCurrentStep] = useState(18);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [completedEvents, setCompletedEvents] = useState({});
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [isWalkthroughActive, setIsWalkthroughActive] = useState(true);
    const [pcZoomed, setPcZoomed] = useState(false);

    const exitWalkthrough = () => {
        setIsWalkthroughActive(false); // Or any logic to hide the walkthrough
    };

    const { description, events } = steps[currentStep] || {};

    const handleBackClick = () => {
        setPcZoomed(false);
    };

    const nextStep = useCallback(() => {
        if (!isTransitioning && currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        }
    }, [isTransitioning, currentStep, steps, completedEvents]);

    const prevStep = () => {
        if (!isTransitioning && currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    }

    const completeEvent = (eventName, stepIndex) => {
        // TODO: wait till lerp animation is done
        if (isTransitioning) {
            return;
        }
        // Ensure that the event only completes if it's the correct step
        if (stepIndex !== currentStep) {
            return;
        }

        // Check if the event is already completed for the given step
        setCompletedEvents((prev) => {
            const isEventAlreadyCompleted = prev[stepIndex]?.[eventName];

            if (isEventAlreadyCompleted) {
                return prev; // Event is already completed, so return previous state
            }

            // If not completed, create a new state object
            const updatedEvents = {
                ...prev,
                [stepIndex]: {
                    ...prev[stepIndex],
                    [eventName]: true,
                },
            };

            // Check if all events for the current step are now completed
            const stepEvents = steps[stepIndex]?.events || {};
            const allEventsCompleted = Object.keys(stepEvents).every(
                (event) => updatedEvents[stepIndex]?.[event] === true
            );

            if (allEventsCompleted) {
                nextStep(); // Move to the next step if all events are completed
            }

            return updatedEvents;
        });
    };

    const handleModelLoad = () => {
        setIsLoading(false);
    };

    return (
        <div className="container">
            <Suspense fallback={<Loading />}>
                {isLoading && <Loading />}
                <Canvas shadows={{ type: THREE.PCFSoftShadowMap, mapSize: { width: 2048, height: 2048 } }} precision="high">
                    {!isWalkthroughActive && <Lighting />}
                    <SoftShadows size={20} samples={16} />
                    <Model
                        ref={modelRef}
                        onLoad={handleModelLoad}
                        completeEvent={completeEvent}
                        isTransitioning={isTransitioning}
                        isWalkthroughActive={isWalkthroughActive}
                        pcZoomed={pcZoomed}
                        setPcZoomed={setPcZoomed}
                    />
                    <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
                    <Stats />
                    <ModelController
                        modelRef={modelRef}
                        isWalkthroughActive={isWalkthroughActive}
                        pcZoomed={pcZoomed}
                    />
                    {isWalkthroughActive && (
                        <>
                            <LightingWalkthrough currentStep={currentStep} />
                            <WalkthroughController
                                steps={steps}
                                currentStep={currentStep}
                                setIsTransitioning={setIsTransitioning}
                            />
                        </>
                    )}
                </Canvas>
                {!isLoading && isWalkthroughActive && (
                    <WalkthroughUI
                        currentStep={currentStep}
                        stepDescription={description}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        isTransitioning={isTransitioning}
                        events={events}
                        completedEvents={completedEvents[currentStep] || {}}
                        exitWalkthrough={exitWalkthrough}
                    />
                )}
                {pcZoomed && (
                    <button
                        onClick={handleBackClick}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            zIndex: 1000,
                        }}
                    >
                        Back
                    </button>
                )}
            </Suspense>
            <SpeedInsights />
            <Analytics />
        </div>
    );
}

export default Home;
