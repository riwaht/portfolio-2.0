import React, { useRef } from 'react';
import { useHelper } from '@react-three/drei';
import { DirectionalLightHelper, PointLightHelper } from 'three';

function Lighting({ isDebugMode = false }) {
    const pointLightRef = useRef();
    const dirLightRef = useRef();

    // Use helpers for debugging
    if (isDebugMode) {
        useHelper(dirLightRef, DirectionalLightHelper, 5);
        useHelper(pointLightRef, PointLightHelper, 2);
    }

    return (
        <>
            {/* Ambient light for baseline illumination */}
            <ambientLight color={0xffffff} intensity={0.3} />

            {/* Point light acting as a light bulb */}
            <pointLight
                ref={pointLightRef}
                color={0xff4400}
                castShadow
                intensity={1.5}
                position={[27, 22, -20]}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />

            {/* Directional light for sunlight-like effect */}
            <directionalLight
                ref={dirLightRef}
                color={0xffffff}
                castShadow
                intensity={1}
                position={[10, 50, 20]}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-near={0.5}
                shadow-camera-far={100}
                shadow-camera-left={-50}
                shadow-camera-right={50}
                shadow-camera-top={50}
                shadow-camera-bottom={-50}
            />

            {/* Hemisphere light for sky and ground effect */}
            <hemisphereLight
                skyColor={0xffffbb} // Sky color
                groundColor={0x080820} // Ground color
                intensity={0.7}
                position={[0, 50, 0]}
            />
        </>
    );
}

export default Lighting;