import React, { useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSpring } from '@react-spring/three';
import * as THREE from 'three';

function WalkthroughController({ steps, currentStep, isTransitioning, setIsTransitioning }) {
    const { camera } = useThree();
    // State to track if camera is transitioning

    // Use react-spring for smooth camera transitions
    const { position, lookAt } = useSpring({
        position: steps[currentStep].position,
        lookAt: steps[currentStep].lookAt,
        config: { tension: 200, friction: 60 },
        onStart: () => setIsTransitioning(true), // Start transitioning
        onRest: () => setIsTransitioning(false), // Transition finished
    });

    // Smoothly update camera position using useFrame
    useFrame(() => {
        const [x, y, z] = position.get();
        const [lx, ly, lz] = lookAt.get();

        // Only interpolate if not currently transitioning
        if (isTransitioning) {
            camera.position.lerp(new THREE.Vector3(x, y, z), 0.2); // Adjust lerp speed
            camera.lookAt(new THREE.Vector3(lx, ly, lz));
        } else {
            // Snap to the target position if transition is not in progress
            camera.position.set(x, y, z);
            camera.lookAt(new THREE.Vector3(lx, ly, lz));
        }
    });

    // Effect to reset camera position when currentStep changes
    useEffect(() => {
        // Update spring values on currentStep change
        position.start(steps[currentStep].position);
        lookAt.start(steps[currentStep].lookAt);
    }, [currentStep, position, lookAt]);

    return null;
}

export default WalkthroughController;
