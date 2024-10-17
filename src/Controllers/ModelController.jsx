import React, { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';

function ModelController({ modelRef, isWalkthroughActive }) {
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [targetRotationY, setTargetRotationY] = useState(0);
    const rotationSpeed = 0.1;

    useFrame(() => {
        if (modelRef.current) {
            modelRef.current.rotation.y += (targetRotationY - modelRef.current.rotation.y) * rotationSpeed;
        }
    });

    useEffect(() => {
        const handleScroll = (event) => {
            if (!isWalkthroughActive) {
                setTargetRotationY((prev) => prev + event.deltaY * 0.001); // Adjust sensitivity here
            }
        };

        if (modelRef.current) {
            setIsModelLoaded(true);
        }

        if (isModelLoaded) {
            window.addEventListener('wheel', handleScroll);
        }

        return () => {
            if (isModelLoaded) {
                window.removeEventListener('wheel', handleScroll);
            }
        };
    }, [modelRef, isModelLoaded, isWalkthroughActive]); // Re-run effect when modelRef, isModelLoaded, or isWalkthroughActive changes

    return null;
}

export default ModelController;
