import React, { Suspense, useRef, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, SoftShadows } from '@react-three/drei';
import Lighting from './Lighting';
import Navbar from './Navbar';
import ModelController from '../Controllers/ModelController';
import '../styles.css';
import Loading from '../Utils/Loading';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from "@vercel/analytics/react";
import * as THREE from 'three';
import AudioPlayer from '../Utils/AudioPlayer';
import PostProcessing from '../Utils/Postprocessing';
import InfoCard from './InfoCard';

function House() {
    const modelRef = useRef();
    const audioRef = useRef();
    const Model = React.lazy(() => import('./Model'));

    const [isLoading, setIsLoading] = useState(true);
    const [isStarted, setIsStarted] = useState(false);
    // The currently focused hotspot (interactable config object), or null in free-roam.
    const [focusTarget, setFocusTarget] = useState(null);
    // Meshes to outline on hover (set from Model's pointer dispatcher).
    const [hoveredMeshes, setHoveredMeshes] = useState(null);

    const handleModelLoad = () => setIsLoading(false);
    const handleStart = () => setIsStarted(true);
    const clearFocus = useCallback(() => setFocusTarget(null), []);

    // Add house-page class to body for overflow control
    useEffect(() => {
        document.body.classList.add('house-page');
        document.documentElement.classList.add('house-page');

        return () => {
            document.body.classList.remove('house-page');
            document.documentElement.classList.remove('house-page');
        };
    }, []);

    return (
        <div className="container">
            <div className="house-navbar">
                <Navbar />
            </div>
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
                        <Lighting />
                        <SoftShadows size={20} samples={16} />
                        <Model
                            ref={modelRef}
                            onLoad={handleModelLoad}
                            focusTarget={focusTarget}
                            setFocusTarget={setFocusTarget}
                            onHoverChange={setHoveredMeshes}
                        />
                        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
                        <ModelController
                            modelRef={modelRef}
                            focusTarget={focusTarget}
                        />
                        <PostProcessing highlightedMeshes={hoveredMeshes} />
                    </Canvas>
                </div>

                {/* Info card for focused 'info' / 'fridge' hotspots */}
                {isStarted && focusTarget && focusTarget.action !== 'pc' && (
                    <InfoCard interactable={focusTarget} onClose={clearFocus} />
                )}

                {/* The PC uses its own on-screen UI, so just offer a way back out */}
                {isStarted && focusTarget && (
                    <button
                        className="house-back-button"
                        onClick={clearFocus}
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

export default House;
