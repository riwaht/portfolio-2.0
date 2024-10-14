import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import Camera from './Camera';
import Lighting from './Lighting';
import ModelController from '../Controllers/ModelController';
import '../styles.css';
import steps from '../Utils/steps.json';
import WalkthroughUI from './WalkthroughUI';
import WalkthroughController from '../Controllers/WalkthroughController';

function Home() {
    const modelRef = useRef();
    const Model = React.lazy(() => import('./Model'));
    const [currentStep, setCurrentStep] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [completedEvents, setCompletedEvents] = useState({}); // Track completed events

    // Destructure step details for clarity
    const { description, events } = steps[currentStep] || {};

    // Move to the next step if all events are completed
    const nextStep = () => {
        if (!isTransitioning && currentStep < steps.length - 1) {
            // Check if all required events for this step are completed
            const allEventsCompleted = events
                ? Object.keys(events).every(event => completedEvents[currentStep]?.[event] === true)
                : true; // If no events, automatically complete

            if (!allEventsCompleted) {
                console.log('All events not completed for this step');
                return;
            }
            setCurrentStep((prev) => prev + 1);
        }
    };

    const prevStep = () => {
        if (!isTransitioning && currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const completeEvent = (eventName) => {
        setCompletedEvents((prev) => ({
            ...prev,
            [currentStep]: {
                ...prev[currentStep],
                [eventName]: true,
            },
        }));
    };

    return (
        <div className="container">
            <header className="header">
                <h1>Riwa Hoteit</h1>
            </header>
            <WalkthroughUI
                currentStep={currentStep}
                stepDescription={description}
                nextStep={nextStep}
                prevStep={prevStep}
                isTransitioning={isTransitioning}
                completeEvent={completeEvent}
                events={events}
                completedEvents={completedEvents[currentStep] || {}}
            />
            <Canvas precision="high" shadows>
                <Suspense fallback={<div>Loading...</div>} />
                <Camera />
                <Lighting />
                <Model ref={modelRef} />
                <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
                <Stats />
                <ModelController modelRef={modelRef} />
                <WalkthroughController
                    steps={steps}
                    currentStep={currentStep}
                    setIsTransitioning={setIsTransitioning}
                />
            </Canvas>
        </div>
    );
}

export default Home;
