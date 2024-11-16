import React, { Suspense, useRef, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats, SoftShadows } from '@react-three/drei';
import LightingWalkthrough from './LightingWalkthrough';
import Lighting from './Lighting';
import ModelController from '../Controllers/ModelController';
import '../styles.css';
import steps from '../Utils/steps.json';
import WalkthroughUI from './WalkthroughUI';
import WalkthroughController from '../Controllers/WalkthroughController';
import Loading from '../Utils/Loading';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from "@vercel/analytics/react";
import * as THREE from 'three';
import AudioPlayer from '../Utils/AudioPlayer';
import PostProcessing from '../Utils/Postprocessing';

function Home() {
    const modelRef = useRef();
    const audioRef = useRef(); 
    const Model = React.lazy(() => import('./Model'));
    const [currentStep, setCurrentStep] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [completedEvents, setCompletedEvents] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isStarted, setIsStarted] = useState(false);
    const [isWalkthroughActive, setIsWalkthroughActive] = useState(true);
    const [pcZoomed, setPcZoomed] = useState(false);
    const [highlightedMesh, setHighlightedMesh] = useState(null);

    const exitWalkthrough = () => {
        setIsWalkthroughActive(false);
    };

    const { description, events, meshName } = steps[currentStep] || {};

    useEffect(() => {
        if (modelRef.current && meshName) {
            const meshes = Array.isArray(meshName)
                ? meshName.map((name) => modelRef.current.getObjectByName(name)).filter(Boolean) // Get each mesh
                : []; // Ensure it's an array or fallback to empty
            setHighlightedMesh(meshes.length ? meshes : null); // Update state
        } else {
            setHighlightedMesh(null); // Clear highlight if no meshName
        }
    }, [currentStep, meshName]);

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
    };

    const completeEvent = (eventName, stepIndex) => {
        if (isTransitioning) {
            return;
        }
        if (stepIndex !== currentStep) {
            return;
        }
        setCompletedEvents((prev) => {
            const isEventAlreadyCompleted = prev[stepIndex]?.[eventName];
            if (isEventAlreadyCompleted) {
                return prev;
            }
            const updatedEvents = {
                ...prev,
                [stepIndex]: {
                    ...prev[stepIndex],
                    [eventName]: true,
                },
            };
            const stepEvents = steps[stepIndex]?.events || {};
            const allEventsCompleted = Object.keys(stepEvents).every(
                (event) => updatedEvents[stepIndex]?.[event] === true
            );

            if (allEventsCompleted) {
                nextStep();
            }

            return updatedEvents;
        });
    };

    const handleModelLoad = () => {
        setIsLoading(false);
    };

    const handleStart = () => {
        setIsStarted(true);
    };

    return (
        <div className="container">
            <Suspense fallback={<Loading isLoading={isLoading} isStarted={isStarted} handleStart={handleStart} />}>
                {!isStarted && <Loading isLoading={isLoading} isStarted={isStarted} handleStart={handleStart} />}
                {isStarted && <AudioPlayer ref={audioRef} />}
                <div
                    style={{
                        visibility: isStarted ? 'visible' : 'hidden',
                        opacity: isStarted ? 1 : 0,
                        position: 'absolute',
                        zIndex: isStarted ? 1 : -1,
                        width: '100%',
                        height: '100%',
                    }}
                >
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
                            currentStep={currentStep}
                        />
                        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
                        <ModelController
                            modelRef={modelRef}
                            isWalkthroughActive={isWalkthroughActive}
                            pcZoomed={pcZoomed}
                        />
                        {isWalkthroughActive && (
                            <>
                                <PostProcessing highlightedMeshes={highlightedMesh} />
                                <LightingWalkthrough currentStep={currentStep} />
                                <WalkthroughController
                                    steps={steps}
                                    currentStep={currentStep}
                                    setIsTransitioning={setIsTransitioning}
                                />
                            </>
                        )}
                    </Canvas>
                </div>
                {isStarted && isWalkthroughActive && (
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
