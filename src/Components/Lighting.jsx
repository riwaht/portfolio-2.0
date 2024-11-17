import React, { useRef } from 'react';
import { Environment, useHelper } from '@react-three/drei';
import { DirectionalLightHelper, PointLightHelper, HemisphereLight } from 'three';

function Lighting() {
    const pointLightRef = useRef();
    const dirLightRef = useRef();

    // Use helper to visualize the lights in the scene
    useHelper(dirLightRef, DirectionalLightHelper, 1);
    useHelper(pointLightRef, PointLightHelper, 1);

    return (
        <>
            {/* Point light (simulating light bulb) */}
            <pointLight
                color={0x800020}
                castShadow
                intensity={300}
                position={[27, 22, -20]}
            />

            <pointLight
                castShadow
                intensity={300}
                position={[27, 22, -20]}
            />

            {/* Hemisphere light using the <hemisphereLight> JSX syntax */}
            <hemisphereLight
                args={[0xffffbb, 0x080820, 0.7]}
            />
        </>
    );
}

export default Lighting;
