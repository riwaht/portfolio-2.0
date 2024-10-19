import React, { useRef } from 'react';
import { useHelper } from '@react-three/drei';
import { DirectionalLightHelper, PointLightHelper } from 'three';

const roomLightMapping = {
    kitchen: [1, 2, 3, 4], // Steps that belong to the kitchen
    gym: [5, 6, 7, 8],
    garden: [9, 10, 11, 12],
    bedroom: [13, 14, 15, 16, 17, 18],
};

function LightingWalkthrough({ currentStep }) {
    const pointLightRef = useRef();
    const pointLightRef2 = useRef();
    const pointLightRef3 = useRef();
    const pointLightRef4 = useRef();

    // Determine the current room based on the step
    const getRoomForStep = () => {
        return Object.keys(roomLightMapping).find((room) =>
            roomLightMapping[room].includes(currentStep)
        );
    };

    const currentRoom = getRoomForStep();

    return (
        <>
            {/* Render lights based on the current room */}
            {(currentRoom === 'kitchen' || currentStep === 0) && (
                <pointLight
                    ref={pointLightRef}
                    castShadow
                    intensity={500}
                    position={[25, 25, 25]}
                />
            )}

            {currentRoom === 'gym' && (
                <pointLight
                    ref={pointLightRef2}
                    castShadow
                    intensity={500}
                    position={[-25, 25, 25]}
                />
            )}

            {currentRoom === 'garden' && (
                <pointLight
                    ref={pointLightRef3}
                    castShadow
                    intensity={500}
                    position={[-25, 25, -25]}
                />
            )}

            {currentRoom === 'bedroom' && (
                <pointLight
                    ref={pointLightRef4}
                    castShadow
                    intensity={500}
                    position={[25, 25, -25]}
                />
            )}

            <hemisphereLight
                args={[0xffffbb, 0x080820, 0.4]}
            />
        </>
    );
}

export default LightingWalkthrough;
