import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import Camera from './Camera';
import Lighting from './Lighting';
import Model from './Model';
import ModelController from '../Controllers/ModelController';
import '../styles.css';

function Home() {
    const modelRef = useRef();

    return (
        <div className="container">
            <header className="header">
                <h1>Riwa Hoteit</h1>
            </header>
            <Canvas precision="high" shadows>
                <Camera />
                <Lighting />
                <Model ref={modelRef} />
                <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
                <Stats />
                <ModelController modelRef={modelRef} />
            </Canvas>
        </div>
    );
}

export default Home;
