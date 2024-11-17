import React, { forwardRef, useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';

const images = [
    '/Images/MainScreen.png',
    '/Images/ImportantImage.png',
    '/Images/RandomImage.png',
];

// Use forwardRef to properly assign the ref
const Model = forwardRef(({ onLoad, isTransitioning, completeEvent, isWalkthroughActive, pcZoomed, setPcZoomed, currentStep, ...props }, ref) => {
    // Use useGLTF with draco loader
    const { nodes, materials, scene } = useGLTF('/Models/house-transformed.glb', true, '/draco-gltf/');
    const receiveOnlyMeshes = ['Floor001', 'Mesh1_GRANITE_0', 'Mesh1_GRANITE_0_1', 'GardenWall', 'WhiteWalls', 'Cube072', 'Cube072_1'];
    const castOnlyMeshes = ['Volleyball', 'defaultMaterial001', 'defaultMaterial', 'Photo', 'Sunflower', 'BoxingGlove', 'shard2_lambert4_0', 'shard3_lambert7_0', 'shard4_lambert5_0', 'shard14_lambert6_0', 'Sac_Sac_0', 'Desk', 'Mario', 'Skateboard', 'Tori', 'Book', 'PS2', 'JBL'];
    const [showFolderBoxes, setShowFolderBoxes] = useState(false);
    const [showImportantBoxes, setShowImportantBoxes] = useState(false);
    const [showRandomBoxes, setShowRandomBoxes] = useState(false);
    const [imageIndex, setImageIndex] = React.useState(0);
    const { camera, gl } = useThree();
    const [fridgeOpen, setFridgeOpen] = useState(false);
    const [doorRotation, setDoorRotation] = useState(0);
    const [doorPosition, setDoorPosition] = useState(0);
    const currentKitchenSteps = [1, 2, 3, 4];
    const currentBedroomSteps = [13, 14, 15, 16, 17, 18, 19];
    const hiddenObjects = ['defaultMaterial', 'defaultMaterial001', 'Mesh1_GRANITE_0', 'Mesh1_GRANITE_0_1', 'WhiteWalls', 'GardenWall', 'Floor001'];

    const handleFridgeClick = useCallback(() => {
        if ((isWalkthroughActive && !currentKitchenSteps.includes(currentStep)) || (!isWalkthroughActive && pcZoomed)) {
            return;
        }

        setFridgeOpen((prev) => !prev);
        if (isWalkthroughActive) {
            // set timeout for 2 seconds to allow the walkthrough to finish
            setTimeout(() => {
                completeEvent('clickFridge', 2);
                setFridgeOpen(false);
            }
                , 2000);
        }
    }, [completeEvent, isWalkthroughActive]);

    useFrame(() => {
        const targetRotation = fridgeOpen ? Math.PI / 2 : 0;
        setDoorRotation((prev) => THREE.MathUtils.lerp(prev, targetRotation, 0.1));
        setDoorPosition((prev) => THREE.MathUtils.lerp(prev, fridgeOpen ? 0.5 : 0, 0.1));
    });

    const textures = useMemo(() => {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.crossOrigin = 'anonymous';
        return images.map((image, index) => {
            const texture = textureLoader.load(
                image,
                () => {
                    console.log(`Texture ${index} loaded successfully:`, image);
                },
                undefined,
                (error) => {
                    console.error(`Failed to load texture ${index}:`, error);
                }
            );
            return texture;
        });
    }, [images]);

    const handleLinkedinClick = () => {
        completeEvent('clickLinkedin', 17);
        window.open('https://www.linkedin.com/in/riwa-hoteit-7236b6204/', '_blank');
    };

    const handleGithubClick = () => {
        window.open('https://github.com/riwaht', '_blank');
    };

    const handleFrontendClick = () => {
        window.open('/PC Documents/Frontend Dev.pdf', '_blank');
    };

    const handleGameDevClick = () => {
        window.open('/PC Documents/Portfolio Game Dev.pdf', '_blank');
    };

    const handleBlenderClick = () => {
        window.open('/PC Documents/Blender Portfolio.pdf', '_blank');
    };

    const handleScreenClick = useCallback(() => {
        if (isWalkthroughActive && !currentBedroomSteps.includes(currentStep)) {
            return;
        }
        
        completeEvent('clickPC', 15);
        if (!showImportantBoxes && !showRandomBoxes) {
            setShowFolderBoxes(true);
        }

        if (!isWalkthroughActive && camera) {
            setPcZoomed(true);
        }
    }, [completeEvent, isWalkthroughActive, pcZoomed, setPcZoomed, showImportantBoxes, showRandomBoxes, camera]);

    useFrame(() => {
        if (pcZoomed) {
            camera.position.lerp(new THREE.Vector3(15, 14, -7), 0.1);
            camera.lookAt(new THREE.Vector3(14, 13, 0));
        } else {
            camera.position.lerp(new THREE.Vector3(40, 30, -30), 0.1);
            camera.lookAt(new THREE.Vector3(0, 0, 0));
        }
    });

    const BoxCollider = ({ position, color, onClick, size }) => (
        <mesh position={position} onClick={onClick} >
            <boxGeometry args={size} />
            <meshStandardMaterial color={color} transparent opacity={0} />
        </mesh>
    );
    const folderBoxes = [
        { show: showFolderBoxes, position: [17, 14.7, -4], color: "red", onClick: () => handleImageClick('important') },
        { show: showFolderBoxes, position: [17, 14, -4], color: "blue", onClick: () => handleImageClick('random') },
        { show: showImportantBoxes, position: [15.7, 14.15, -4], color: "red", onClick: handleLinkedinClick },
        { show: showImportantBoxes, position: [15, 14.15, -4], color: "red", onClick: handleGameDevClick },
        { show: showImportantBoxes, position: [14.3, 14.15, -4], color: "red", onClick: handleFrontendClick },
        { show: showImportantBoxes, position: [13.5, 14.15, -4], color: "red", onClick: handleGithubClick },
        { show: showImportantBoxes, position: [12.5, 14.9, -5], color: "blue", onClick: () => handleImageClick('exit'), size: [0.2, 0.2, 0.2] },
        { show: showRandomBoxes, position: [12.5, 14.9, -5], color: "blue", onClick: () => handleImageClick('exit'), size: [0.2, 0.2, 0.2] },
        { show: showRandomBoxes, position: [15.7, 14.15, -4], color: "red", onClick: handleBlenderClick },
    ];

    // Ensure ref is assigned when the model is loaded
    useEffect(() => {
        if (scene && ref) {
            ref.current = scene;  // Assign the model scene to ref
            if (onLoad) onLoad(scene);  // Call the onLoad callback if provided

            hiddenObjects.forEach((objectName) => {
                const obj = scene.getObjectByName(objectName);
                if (obj) {
                    obj.visible = false; // Hide the object
                }
            });
        }
    }, [scene, ref, onLoad]);  // Only run this effect when scene or ref changes

    const handleImageClick = React.useCallback((type) => {
        switch (type) {
            case 'important':
                setImageIndex(1);
                completeEvent('clickFolder', 16);
                setShowImportantBoxes(true);
                setShowRandomBoxes(false);
                setShowFolderBoxes(false);
                break;
            case 'random':
                setImageIndex(2);
                setShowRandomBoxes(true);
                setShowImportantBoxes(false);
                setShowFolderBoxes(false);
                break;
            case 'exit':
                setImageIndex(0);
                completeEvent('clickX', 18);
                setShowFolderBoxes(true);
                setShowImportantBoxes(false);
                setShowRandomBoxes(false);
                break;
            default:
                console.warn('Unknown image type:', type);
        }
    }, [completeEvent]);


    useEffect(() => {
        if (materials['Screen.002']?.map && textures[imageIndex]?.image) {
            const texture = textures[imageIndex];
            texture.flipY = false;
            texture.colorSpace = THREE.SRGBColorSpace;
            materials['Screen.002'].map = texture;
            materials['Screen.002'].needsUpdate = true;
        }

        if (showImportantBoxes || showRandomBoxes) {
            setShowFolderBoxes(false);
        }
    }, [imageIndex, materials, textures]);

    // Loop over nodes and apply shadow settings based on object name
    useMemo(() => {
        Object.values(nodes).forEach((obj) => {
            if (obj.isMesh && obj.name) {
                // Check if the object's name is in the 'receiveOnlyMeshes' list
                if (receiveOnlyMeshes.includes(obj.name)) {
                    // Only receive shadows
                    obj.receiveShadow = true;
                    obj.castShadow = false;
                } else if (castOnlyMeshes.includes(obj.name)) {
                    // Only cast shadows
                    obj.receiveShadow = false;
                    obj.castShadow = true;
                } else {
                    // Both receive and cast shadows
                    obj.receiveShadow = true;
                    obj.castShadow = true;
                }
            }
        });
    }, [nodes]);

    return (
        <>
            {!onLoad ? null :
                <primitive object={scene} dispose={null} ref={ref} {...props}>
                    <group {...props} dispose={null}>
                        <mesh
                            name="FridgeDoor"
                            geometry={nodes.defaultMaterial.geometry}
                            material={materials.Frige_Door}
                            onClick={handleFridgeClick}
                            position={[26.006 + doorPosition, 9.21, 8.651]}
                            rotation={[0, doorRotation, 0]}
                        />
                        <mesh
                            name="Fridge"
                            geometry={nodes.defaultMaterial001.geometry}
                            material={materials.Frige}
                            castShadow
                        />
                        <mesh geometry={nodes.WhiteWalls.geometry} material={materials.PaletteMaterial001} receiveShadow />
                        <mesh geometry={nodes.GardenWall.geometry} material={nodes.GardenWall.material} receiveShadow />
                        <mesh geometry={nodes.Floor001.geometry} material={materials.Parquet} receiveShadow />
                        <mesh geometry={nodes.Screen2.geometry} material={materials['Screen.002']} onClick={handleScreenClick} />
                        <mesh geometry={nodes.Screen.geometry} material={materials['Screen.001']} onClick={handleScreenClick} />
                        {folderBoxes.map((box, index) => (
                            box.show && (
                                <BoxCollider
                                    key={index}
                                    position={box.position}
                                    color={box.color}
                                    onClick={box.onClick}
                                    size={box.size || [0.5, 0.5, 0.5]} // Default size
                                />
                            )
                        ))}
                        <mesh geometry={nodes.Mesh1_GRANITE_0.geometry} material={materials.GRANITE} receiveShadow />
                        <mesh geometry={nodes.Mesh1_GRANITE_0_1.geometry} material={materials['GRANITE.001']} receiveShadow />
                    </group>
                </primitive>
            }
        </>
    );
});

export default React.memo(Model);

// Don't forget to preload Draco decoder
useGLTF.preload('/Models/house-transformed.glb', true, '/draco-gltf/');
