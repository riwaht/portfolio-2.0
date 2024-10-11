import React, { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';

function ModelController({ modelRef }) {
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
            setTargetRotationY((prev) => prev + event.deltaY * 0.001);  // Adjust sensitivity here
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
    }, [modelRef, isModelLoaded]);  // Re-run effect when modelRef or isModelLoaded changes

    return null;
}

export default ModelController;
