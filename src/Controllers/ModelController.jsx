import React, { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';

function ModelController({ modelRef, focusTarget }) {
    const [targetRotationY, setTargetRotationY] = useState(0);
    const rotationSpeed = 0.1;

    useFrame(() => {
        if (modelRef.current) {
            modelRef.current.rotation.y += (targetRotationY - modelRef.current.rotation.y) * rotationSpeed;
        }
    });

    // When a hotspot is focused, return the house to its front (rotation 0) so the
    // world-space focus framings line up with the object.
    useEffect(() => {
        if (focusTarget) {
            setTargetRotationY(0);
        }
    }, [focusTarget]);

    // Scroll wheel spins the whole house in free-roam (disabled while focused).
    useEffect(() => {
        const handleScroll = (event) => {
            if (!focusTarget) {
                setTargetRotationY((prev) => prev + event.deltaY * 0.001);
            }
        };

        window.addEventListener('wheel', handleScroll);

        return () => {
            window.removeEventListener('wheel', handleScroll);
        };
    }, [focusTarget]);

    return null;
}

export default ModelController;
