import React, { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';

function ModelController({ modelRef, isWalkthroughActive, pcZoomed }) {
    const [targetRotationY, setTargetRotationY] = useState(0);
    const rotationSpeed = 0.1;

    useFrame(() => {
        if (modelRef.current) {
            modelRef.current.rotation.y += (targetRotationY - modelRef.current.rotation.y) * rotationSpeed;
        }
    });

    useEffect(() => {
        setTargetRotationY(0); // Reset rotation on load
        const handleScroll = (event) => {
            if (!isWalkthroughActive && !pcZoomed) {
                setTargetRotationY((prev) => prev + event.deltaY * 0.001); // Adjust sensitivity here
            }
        };

        window.addEventListener('wheel', handleScroll);

        return () => {
            window.removeEventListener('wheel', handleScroll);
        };
    }, [isWalkthroughActive, pcZoomed]);

    return null;
}

export default ModelController;
