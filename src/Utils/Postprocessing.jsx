import React, { useEffect, useRef } from 'react';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
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
        outlinePass.current.edgeStrength = 5; // Increase strength
        outlinePass.current.edgeThickness = 5; // Adjust for thicker outlines
        outlinePass.current.visibleEdgeColor.set(0x007bff); // Set outline color
        outlinePass.current.hiddenEdgeColor.set(0x007bff); // Set hidden outline color
        composer.current.addPass(outlinePass.current);

        return () => {
            composer.current = null;
            outlinePass.current = null;
        };
    }, [gl, scene, camera, size]);

    useEffect(() => {
        if (outlinePass.current) {
            if (highlightedMeshes && highlightedMeshes.length > 0) {
                outlinePass.current.selectedObjects = highlightedMeshes; // Set highlighted meshes
            } else {
                outlinePass.current.selectedObjects = []; // Clear highlights
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