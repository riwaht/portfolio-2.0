import { useHelper } from '@react-three/drei';
import React, { useRef } from 'react';
import { PointLightHelper } from 'three';

const roomLightMapping = {
    kitchen: [1, 2, 3, 4], // Steps that belong to the kitchen
    gym: [5, 6, 7, 8],
    garden: [9, 10, 11, 12],
    bedroom: [13, 14, 15, 16, 17, 18, 19],
};

function LightingWalkthrough({ currentStep }) {
    const pointLightRef = useRef();
    const getRoomForStep = () => {
        return Object.keys(roomLightMapping).find((room) =>
            roomLightMapping[room].includes(currentStep)
        );
    };

    useHelper(pointLightRef, PointLightHelper, 2);

    const currentRoom = getRoomForStep();

    return (
        <>
            {(currentRoom === 'kitchen' || currentStep === 0) && (
                <>
                    <pointLight
                        castShadow
                        intensity={2000}
                        position={[25, 25, 25]}
                    />
                </>
            )}

            {currentRoom === 'gym' && (
                <>
                    <pointLight
                        castShadow
                        intensity={2000}
                        position={[-25, 25, 25]}
                    />
                    
                </>
            )}

            {currentRoom === 'garden' && (
                <pointLight
                    castShadow
                    intensity={2000}
                    position={[-20, 30, -20]}
                />
            )}

            {currentRoom === 'bedroom' && (
                <pointLight
                    castShadow
                    intensity={2000}
                    position={[25, 25, -25]}
                />
            )}

            {/* Add ambient light for general soft illumination */}
            <ambientLight intensity={0.3} />

            {/* Keep hemisphere light for natural fill */}
            <hemisphereLight args={[0xffffbb, 0x080820, 0.6]} />
        </>
    );
}

export default LightingWalkthrough;
