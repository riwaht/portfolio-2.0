import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import Camera from './Camera';
import Lighting from './Lighting';
import ModelController from '../Controllers/ModelController';
import '../styles.css';
import steps from '../Utils/steps.json';
import WalkthroughUI from './WalkthroughUI';
import WalkthroughController from '../Controllers/WalkthroughController';
import Loading from '../Utils/Loading'; // Import the Loading component
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from "@vercel/analytics/react"

function Home() {
    const modelRef = useRef();
    const Model = React.lazy(() => import('./Model'));
    const [currentStep, setCurrentStep] = useState(15);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [completedEvents, setCompletedEvents] = useState({});
    const [isLoading, setIsLoading] = useState(true); // Loading state

    const { description, events } = steps[currentStep] || {};

    const nextStep = () => {
        if (!isTransitioning && currentStep < steps.length - 1) {
            const allEventsCompleted = events
                ? Object.keys(events).every(event => completedEvents[currentStep]?.[event] === true)
                : true;

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

    const handleModelLoad = () => {
        setIsLoading(false);
    };

    return (
        <div className="container">
            
            <Suspense fallback={<Loading />}>
                {isLoading && <Loading />}
                <Canvas precision="high" shadows>
                    <Camera />
                    <Lighting />
                    <Model ref={modelRef} onLoad={handleModelLoad} completeEvent={completeEvent} />
                    <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
                    <Stats />
                    <ModelController modelRef={modelRef} />
                    <WalkthroughController
                        steps={steps}
                        currentStep={currentStep}
                        setIsTransitioning={setIsTransitioning}
                    />
                </Canvas>
                {!isLoading && (
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
                )}
            </Suspense>
            <SpeedInsights />
            <Analytics />
        </div>
    );
}

export default Home;
