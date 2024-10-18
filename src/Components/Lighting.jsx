import React, { useRef } from 'react'
import { Environment, useHelper } from '@react-three/drei'
import { DirectionalLightHelper, PointLightHelper } from 'three'

function Lighting() {
    const pointLightRef = useRef()
    const dirLightRef = useRef()
    useHelper(dirLightRef, DirectionalLightHelper, 1);
    useHelper(pointLightRef, PointLightHelper, 1);

    return (
        <>
            {/* Point light (simulating light bulb) */}
            <pointLight
                color={0x800020}
                castShadow
                intensity={500}
                position={[27, 22, -20]}
            />

            <pointLight
                castShadow
                intensity={400}
                position={[27, 22, -20]}
            />
        </>
    )
}

export default Lighting
