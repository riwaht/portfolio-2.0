import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { interactables } from '../Utils/interactables';

// Persistent "glowing dot" markers that float on each interactive object so
// visitors know what's clickable. Rendered as a child of the model scene so the
// markers rotate with the house. Positions are computed once, in the scene's
// local space, from each hotspot's primary mesh.
function Hotspots({ scene, onSelect, visible }) {
    const markers = useMemo(() => {
        if (!scene) return [];
        scene.updateMatrixWorld(true);
        const box = new THREE.Box3();
        const center = new THREE.Vector3();
        return interactables
            .map((item) => {
                // Union the bounding boxes of all the hotspot's meshes so the marker
                // sits on the object's visual center (GLTF mesh origins are unreliable).
                box.makeEmpty();
                item.meshNames.forEach((name) => {
                    const mesh = scene.getObjectByName(name);
                    if (mesh) box.expandByObject(mesh);
                });
                if (box.isEmpty()) return null;
                box.getCenter(center);
                scene.worldToLocal(center); // express in the (rotating) scene's local frame
                return { item, position: [center.x, center.y, center.z] };
            })
            .filter(Boolean);
    }, [scene]);

    if (!visible) return null;

    return (
        <>
            {markers.map(({ item, position }) => (
                <Html
                    key={item.id}
                    position={position}
                    center
                    distanceFactor={45}
                    zIndexRange={[100, 0]}
                    wrapperClass="house-hotspot-wrapper"
                >
                    <button
                        type="button"
                        className="house-hotspot"
                        aria-label={item.label}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect(item);
                        }}
                    >
                        <span className="house-hotspot-dot" />
                        <span className="house-hotspot-label">{item.label}</span>
                    </button>
                </Html>
            ))}
        </>
    );
}

export default Hotspots;
