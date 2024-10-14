import React from 'react'
import { useThree } from '@react-three/fiber'

function Camera() {
    const { camera } = useThree()
    camera.position.set(10, 30, 50)

    return null
}

export default Camera
