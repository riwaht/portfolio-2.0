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
const Model = forwardRef(({ onLoad, isTransitioning, completeEvent, isWalkthroughActive, pcZoomed, setPcZoomed, ...props }, ref) => {
    // Use useGLTF with draco loader
    const { nodes, materials, scene } = useGLTF('/Models/house-transformed.glb', true, '/draco-gltf/');
    const receiveOnlyMeshes = ['Floor001', 'Mesh1_GRANITE_0', 'Mesh1_GRANITE_0_1', 'GardenWall', 'WhiteWalls', 'Cube072', 'Cube072_1'];
    const castOnlyMeshes = ['Volleyball', 'defaultMaterial001', 'defaultMaterial', 'Photo', 'Sunflower'];
    const [showFolderBoxes, setShowFolderBoxes] = useState(false);
    const [showImportantBoxes, setShowImportantBoxes] = useState(false);
    const [showRandomBoxes, setShowRandomBoxes] = useState(false);
    const [imageIndex, setImageIndex] = React.useState(0);
    const { camera } = useThree();

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


    const handleCVClick = () => {
        completeEvent('clickCV', 17);
        window.open('/PC Documents/Riwa Hoteit, CV.pdf', '_blank');
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
        completeEvent('clickPC', 15);
        if (!showImportantBoxes && !showRandomBoxes) {
            setShowFolderBoxes(true);
        }

        if (!isWalkthroughActive && camera) {
            setPcZoomed(true);
            console.log(pcZoomed);
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
        <mesh position={position} onClick={onClick}>
            <boxGeometry args={size} />
            <meshStandardMaterial color={color} transparent opacity={0} />
        </mesh>
    );
    const folderBoxes = [
        { show: showFolderBoxes, position: [17, 14.7, -4], color: "red", onClick: () => handleImageClick('important') },
        { show: showFolderBoxes, position: [17, 14, -4], color: "blue", onClick: () => handleImageClick('random') },
        { show: showImportantBoxes, position: [15.7, 14.15, -4], color: "red", onClick: handleCVClick },
        { show: showImportantBoxes, position: [15, 14.15, -4], color: "red", onClick: handleFrontendClick },
        { show: showImportantBoxes, position: [14.3, 14.15, -4], color: "red", onClick: handleGameDevClick },
        { show: showImportantBoxes, position: [12.5, 14.9, -5], color: "blue", onClick: () => handleImageClick('exit'), size: [0.2, 0.2, 0.2] },
        { show: showRandomBoxes, position: [12.5, 14.9, -5], color: "blue", onClick: () => handleImageClick('exit'), size: [0.2, 0.2, 0.2] },
        { show: showRandomBoxes, position: [15.7, 14.15, -4], color: "red", onClick: handleBlenderClick },
    ];

    // Ensure ref is assigned when the model is loaded
    useEffect(() => {
        if (scene && ref) {
            ref.current = scene;  // Assign the model scene to ref
            if (onLoad) onLoad(scene);  // Call the onLoad callback if provided
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
                        <mesh geometry={nodes.defaultMaterial.geometry} material={materials.Frige_Door} position={[26.48, 10.644, 8.653]} rotation={[-Math.PI, 0, -Math.PI]} scale={4.583} />
                        <mesh geometry={nodes.defaultMaterial001.geometry} material={materials.Frige} position={[22.082, 1.473, 4.701]} rotation={[0, -1.571, 0]} scale={4.583} />
                        <mesh geometry={nodes.WhiteWalls.geometry} material={materials.PaletteMaterial001} receiveShadow />
                        <mesh geometry={nodes.GardenWall.geometry} material={nodes.GardenWall.material} receiveShadow />
                        <mesh geometry={nodes.Floor001.geometry} material={materials.Parquet} receiveShadow />
                        <mesh geometry={nodes.Riwa.geometry} material={materials.Akira} position={[26.224, 1.498, -23.295]} rotation={[Math.PI, 0, Math.PI]} scale={[1, 1.363, 1]} />
                        <mesh geometry={nodes.Panes.geometry} material={materials.PaletteMaterial002} />
                        <mesh geometry={nodes.Desk.geometry} material={materials.Desk} />
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
                        <mesh geometry={nodes.Photo.geometry} material={materials['Material.001']} position={[0.006, -0.028, 0.065]} scale={[1, 1.006, 1]} />
                        <mesh geometry={nodes.Photoframe.geometry} material={materials.Photoframe} />
                        <mesh geometry={nodes.Tori.geometry} material={materials['lambert1.001']} />
                        <mesh geometry={nodes.Skateboard.geometry} material={materials.Skateboard} />
                        <mesh geometry={nodes.Tokyo_Ghoul_Manga.geometry} material={materials.TokyoGhoul} />
                        <mesh geometry={nodes.PS2.geometry} material={materials.PS2} />
                        <mesh geometry={nodes.Volleyball.geometry} material={materials.Volleyball} />
                        <mesh geometry={nodes.Mousepad.geometry} material={materials.PaletteMaterial003} />
                        <mesh geometry={nodes.JBL.geometry} material={materials.JBL} />
                        <mesh geometry={nodes.SwitchScreen.geometry} material={materials.obj01_001} />
                        <mesh geometry={nodes.Switch.geometry} material={materials.obj00_001_1} />
                        <mesh geometry={nodes.Mario.geometry} material={materials.initialShadingGroup} />
                        <mesh geometry={nodes.Chair.geometry} material={materials.Matteplastic} />
                        <mesh geometry={nodes.Stove.geometry} material={materials.Stove} />
                        <mesh geometry={nodes.Plant.geometry} material={materials['PlantSucculentEcheveria001_2K_2K.001']} />
                        <mesh geometry={nodes.Flour.geometry} material={materials.Material_01} />
                        <mesh geometry={nodes.Eggs.geometry} material={materials.material_0} />
                        <mesh geometry={nodes.Bowl.geometry} material={materials.None} />
                        <mesh geometry={nodes.EggsSeparate.geometry} material={materials['DefaultMaterial.001']} />
                        <mesh geometry={nodes.Cutting_Board.geometry} material={materials.CuttingBoard_A} />
                        <mesh geometry={nodes.Dishwashing.geometry} material={materials.Utensils_B} />
                        <mesh geometry={nodes.Knife.geometry} material={materials.Knives_A} />
                        <mesh geometry={nodes.Pan.geometry} material={materials.Pans_A} />
                        <mesh geometry={nodes.Spatula.geometry} material={materials.Utensils_A} />
                        <mesh geometry={nodes.Toaster.geometry} material={materials.Kitchen_Machinery_A} />
                        <mesh geometry={nodes.Towel2.geometry} material={materials.Towels} />
                        <mesh geometry={nodes.Lights.geometry} material={materials.StingrayPBS1SG} />
                        <mesh geometry={nodes.Dip_Bar.geometry} material={materials.Dips} />
                        <mesh geometry={nodes.BoxingGlove.geometry} material={materials.Glove} />
                        <mesh geometry={nodes.Parallettes.geometry} material={materials['Parallettes.002']} />
                        <mesh geometry={nodes.WaterPipe__0.geometry} material={materials['Scene_-_Root.001']} />
                        <mesh geometry={nodes.Sunflower.geometry} material={materials.lambert16} />
                        <mesh geometry={nodes.Attaches_Attaches_0.geometry} material={materials.Attaches} />
                        <mesh geometry={nodes.Chaine1_Chaine_0.geometry} material={materials.Chaine} />
                        <mesh geometry={nodes.Sac_TourSac_0.geometry} material={materials.TourSac} />
                        <mesh geometry={nodes.Sac_Sac_0.geometry} material={materials['material.001']} />
                        <mesh geometry={nodes.SupportFixe_GrosseBoucle_0.geometry} material={materials.GrosseBoucle} />
                        <mesh geometry={nodes.shard2_lambert4_0.geometry} material={materials.lambert4} />
                        <mesh geometry={nodes.shard3_lambert7_0.geometry} material={materials.lambert7} />
                        <mesh geometry={nodes.shard4_lambert5_0.geometry} material={materials.lambert5} />
                        <mesh geometry={nodes.shard14_lambert6_0.geometry} material={materials.lambert6} />
                        <mesh geometry={nodes.Mouse_1.geometry} material={materials.standardSurface13} />
                        <mesh geometry={nodes.Mouse_2.geometry} material={materials.standardSurface12} />
                        <mesh geometry={nodes.usb003.geometry} material={materials.usb} />
                        <mesh geometry={nodes.usb003_1.geometry} material={materials['test-aorus-m2-souris-aorus-rgb2']} />
                        <mesh geometry={nodes.usb003_2.geometry} material={materials['rgb-hdd-cover-aorus-v1']} />
                        <mesh geometry={nodes.usb003_3.geometry} material={materials['NVIDIA LOGO']} />
                        <mesh geometry={nodes.usb003_4.geometry} material={materials.MOBOAORUSORANGETRANS} />
                        <mesh geometry={nodes.usb003_5.geometry} material={materials['metal-mesh-500x500']} />
                        <mesh geometry={nodes.usb003_6.geometry} material={materials['maxresdefault (1)']} />
                        <mesh geometry={nodes.usb003_7.geometry} material={materials.IOSHIELD} />
                        <mesh geometry={nodes.usb003_8.geometry} material={materials['Material.051']} />
                        <mesh geometry={nodes.usb003_9.geometry} material={materials['Material.041']} />
                        <mesh geometry={nodes.usb003_10.geometry} material={materials['Material.086']} />
                        <mesh geometry={nodes.usb003_11.geometry} material={materials['Material.063']} />
                        <mesh geometry={nodes.usb003_12.geometry} material={materials['Material.059']} />
                        <mesh geometry={nodes.usb003_13.geometry} material={materials.PaletteMaterial004} />
                        <mesh geometry={nodes.usb003_14.geometry} material={materials['Material.035']} />
                        <mesh geometry={nodes.usb003_15.geometry} material={materials['Material.027']} />
                        <mesh geometry={nodes.usb003_16.geometry} material={materials['Material.026']} />
                        <mesh geometry={nodes.usb003_17.geometry} material={materials['Material.008']} />
                        <mesh geometry={nodes.usb003_18.geometry} material={materials.PaletteMaterial005} />
                        <mesh geometry={nodes.usb003_19.geometry} material={materials.PaletteMaterial006} />
                        <mesh geometry={nodes.usb003_20.geometry} material={materials['Material.020']} />
                        <mesh geometry={nodes.usb003_21.geometry} material={materials['Material.016']} />
                        <mesh geometry={nodes.usb003_22.geometry} material={materials['aorus logotranspa']} />
                        <mesh geometry={nodes.usb003_23.geometry} material={materials['aorus case fans']} />
                        <mesh geometry={nodes.usb003_24.geometry} material={materials['Material.052']} />
                        <mesh geometry={nodes.usb003_25.geometry} material={materials['Material.038']} />
                        <mesh geometry={nodes.usb003_26.geometry} material={materials['Material.022']} />
                        <mesh geometry={nodes.Cube072.geometry} material={materials.ParquetTable} />
                        <mesh geometry={nodes.Cube072_1.geometry} material={materials.ParquetTableSides} />
                        <mesh geometry={nodes.Object_0010.geometry} material={materials.Rakovina} />
                        <mesh geometry={nodes.Object_0010_1.geometry} material={materials.Material} />
                        <mesh geometry={nodes.Object_2004.geometry} material={materials.StingrayPBS4SG} />
                        <mesh geometry={nodes.Object_2004_1.geometry} material={materials.StingrayPBS5SG} />
                        <mesh geometry={nodes.Mesh1_GRANITE_0.geometry} material={materials.GRANITE} receiveShadow />
                        <mesh geometry={nodes.Mesh1_GRANITE_0_1.geometry} material={materials['GRANITE.001']} receiveShadow />
                        <mesh geometry={nodes.Object_3003.geometry} material={materials.bark} />
                        <mesh geometry={nodes.Object_3003_1.geometry} material={materials.foliage} />
                        <mesh geometry={nodes.Object_3003_2.geometry} material={materials.fruit} />
                        <mesh geometry={nodes.LONG_skinny_1_mesh_hedge_dom_creame_0001.geometry} material={materials.dom_creame} />
                        <mesh geometry={nodes.LONG_skinny_1_mesh_hedge_dom_creame_0001_1.geometry} material={materials.model} />
                    </group>
                </primitive>
            }
        </>
    );
});

export default React.memo(Model);

// Don't forget to preload Draco decoder
useGLTF.preload('/Models/house-transformed.glb', true, '/draco-gltf/');
