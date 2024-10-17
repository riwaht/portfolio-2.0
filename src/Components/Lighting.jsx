import React, { useRef } from 'react'
import { Environment, useHelper } from '@react-three/drei'
import { DirectionalLightHelper, PointLightHelper } from 'three'

function Lighting() {
    const dirLightRef = useRef()
    const pointLightRef = useRef()
    useHelper(dirLightRef, DirectionalLightHelper, 1);
    useHelper(pointLightRef, PointLightHelper, 1);

    return (
        <>
            {/* HDRI for realistic environment lighting */}
            <Environment preset="apartment" />

            {/* Soft ambient light for base lighting */}
            {/* <ambientLight intensity={0.2} /> */}

            {/* Point light (simulating light bulb) */}
            <pointLight
                ref={pointLightRef}
                castShadow
                intensity={1000}
                position={[-5, 25, 40]}
            />

            {/* Directional light (simulating sunlight) */}
        </>
    )
}

export default Lighting
