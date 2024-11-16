import React, { useEffect, useRef } from 'react';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const PostProcessing = ({ highlightedMeshes }) => {
    const { gl, scene, camera, size } = useThree();
    const composer = useRef();
    const outlinePass = useRef();

    useEffect(() => {
        composer.current = new EffectComposer(gl);
        composer.current.addPass(new RenderPass(scene, camera));

        outlinePass.current = new OutlinePass(new THREE.Vector2(size.width, size.height), scene, camera);
        outlinePass.current.edgeStrength = 5;
        outlinePass.current.edgeThickness = 2;
        outlinePass.current.visibleEdgeColor.set(0x000000); // Black outline
        composer.current.addPass(outlinePass.current);

        const bloomPass = new UnrealBloomPass(new THREE.Vector2(size.width, size.height), 1.5, 0.4, 0.85);
        composer.current.addPass(bloomPass);

        return () => {
            composer.current = null;
            outlinePass.current = null;
        };
    }, [gl, scene, camera, size]);

    useEffect(() => {
        if (outlinePass.current) {
            if (highlightedMeshes && highlightedMeshes.length > 0) {
                outlinePass.current.selectedObjects = highlightedMeshes; // Set new highlighted meshes
            } else {
                outlinePass.current.selectedObjects = []; // Clear previous highlight
            }
        }
    }, [highlightedMeshes]);

    useEffect(() => {
        const animate = () => {
            requestAnimationFrame(animate);
            composer.current?.render();
        };
        animate();
    }, []);

    return null;
};

export default PostProcessing;