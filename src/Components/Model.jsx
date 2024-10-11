import React, { forwardRef, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Use forwardRef to properly assign the ref
const Model = forwardRef((props, ref) => {
    // Use useGLTF with draco loader
    const { nodes, materials, scene } = useGLTF('/Models/house-transformed.glb', true, '/draco-gltf/');

    const receiveOnlyMeshes = ['KitchenWall', 'GymWall', 'Cube082', 'Cube082_1', 'BedroomWall', 'Mesh1_GRANITE_0', 'Mesh1_GRANITE_0_1'];

    // Ensure ref is assigned when the model is loaded
    useEffect(() => {
        if (scene && ref) {
            ref.current = scene;  // Assign the model scene to ref
            console.log("Model has loaded, ref is assigned:", ref.current);
        }
    }, [scene, ref]);  // Only run this effect when scene or ref changes

    // Loop over nodes and apply shadow settings based on object name
    useMemo(() => {
        Object.values(nodes).forEach((obj) => {
            if (obj.isMesh && obj.name) {
                console.log("Found mesh:", obj.name);

                // Check if the object's name is in the 'receiveOnlyMeshes' list
                if (receiveOnlyMeshes.includes(obj.name)) {
                    obj.castShadow = false;  // Only receive shadows
                    obj.receiveShadow = true;
                } else {
                    obj.castShadow = true;   // Both cast and receive shadows
                    obj.receiveShadow = true;
                }
            }
        });
    }, [nodes]);

    return (
        <primitive object={scene} dispose={null} ref={ref} {...props}>
            <group {...props} dispose={null}>
                <mesh geometry={nodes.WhiteWalls.geometry} material={nodes.WhiteWalls.material} />
                <mesh geometry={nodes.Desk.geometry} material={materials.WoodTable} />
                <mesh geometry={nodes.Screen2.geometry} material={materials['Screen.001']} />
                <mesh geometry={nodes.Photoframe.geometry} material={materials.lambert1} />
                <mesh geometry={nodes.Tori.geometry} material={materials['lambert1.001']} />
                <mesh geometry={nodes.Skateboard.geometry} material={materials['initialShadingGroup.001']} />
                <mesh geometry={nodes.Akira.geometry} material={materials.model_Material_u1_v1} />
                <mesh geometry={nodes.Gameboy.geometry} material={materials.Gameboy} />
                <mesh geometry={nodes.PS2.geometry} material={materials['Material.003']} />
                <mesh geometry={nodes.Volleyball.geometry} material={materials.Volleyball} />
                <mesh geometry={nodes.Mousepad.geometry} material={materials.PaletteMaterial002} />
                <mesh geometry={nodes.JBL.geometry} material={materials['Material.002']} />
                <mesh geometry={nodes.Mario.geometry} material={materials.initialShadingGroup} />
                <mesh geometry={nodes.Chair.geometry} material={materials.Matteplastic} />
                <mesh geometry={nodes.Fridge.geometry} material={materials['Cube.016__0.001']} />
                <mesh geometry={nodes.Flour.geometry} material={materials.Material_01} />
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
                <mesh geometry={nodes.Dip_Bar.geometry} material={materials['Dips.001']} />
                <mesh geometry={nodes.Parallettes.geometry} material={materials.Dips} />
                <mesh geometry={nodes.Mat.geometry} material={materials.Mat} receiveShadow/>
                <mesh geometry={nodes.BoxingGlove.geometry} material={materials.Glove} />
                <mesh geometry={nodes.Sunflower.geometry} material={materials.lambert2SG} />
                <mesh geometry={nodes.WaterPipe__0.geometry} material={materials['Scene_-_Root.001']} />
                <mesh geometry={nodes.Attaches_Attaches_0.geometry} material={materials.Attaches} />
                <mesh geometry={nodes.Chaine1_Chaine_0.geometry} material={materials.Chaine} />
                <mesh geometry={nodes.Sac_TourSac_0.geometry} material={materials.TourSac} />
                <mesh geometry={nodes.Sac_Sac_0.geometry} material={materials['material.001']} />
                <mesh geometry={nodes.SupportFixe_GrosseBoucle_0.geometry} material={materials.GrosseBoucle} />
                <mesh geometry={nodes.shard2_lambert4_0.geometry} material={materials.lambert4} />
                <mesh geometry={nodes.shard3_lambert7_0.geometry} material={materials.lambert7} />
                <mesh geometry={nodes.shard4_lambert5_0.geometry} material={materials.lambert5} />
                <mesh geometry={nodes.shard14_lambert6_0.geometry} material={materials.lambert6} />
                <mesh geometry={nodes.Cube082.geometry} material={materials.Parquet} receiveShadow={true} />
                <mesh geometry={nodes.Cube082_1.geometry} material={materials.PaletteMaterial001} />
                <mesh geometry={nodes.Object_3001.geometry} material={materials.standardSurface13} />
                <mesh geometry={nodes.Object_3001_1.geometry} material={materials.standardSurface12} />
                <mesh geometry={nodes.pPlane1_grass_T_0.geometry} material={materials.grass_T} />
                <mesh geometry={nodes.pPlane1_grass_T_0_1.geometry} material={materials.mat_blue_toto} />
                <mesh geometry={nodes.pPlane1_grass_T_0_2.geometry} material={materials.mat_Totoro} />
                <mesh geometry={nodes.pPlane1_grass_T_0_3.geometry} material={materials.mat_white_toto} />
                <mesh geometry={nodes.Object_0012.geometry} material={materials.Tokyo_Ghoul_Eng_1} />
                <mesh geometry={nodes.Object_0012_1.geometry} material={materials.Side} />
                <mesh geometry={nodes.Object_0012_2.geometry} material={materials.Tokyo_Ghoul_Eng_2} />
                <mesh geometry={nodes.Object_0012_3.geometry} material={materials.Tokyo_Ghoul_Eng_3} />
                <mesh geometry={nodes.Object_0012_4.geometry} material={materials.Tokyo_Ghoul_Eng_4} />
                <mesh geometry={nodes.Object_0012_5.geometry} material={materials.Tokyo_Ghoul_Eng_5} />
                <mesh geometry={nodes.Object_0012_6.geometry} material={materials.Tokyo_Ghoul_Eng_6} />
                <mesh geometry={nodes.Object_0012_7.geometry} material={materials.Tokyo_Ghoul_Eng_7} />
                <mesh geometry={nodes.Object_0012_8.geometry} material={materials.Tokyo_Ghoul_Eng_8} />
                <mesh geometry={nodes.Object_0012_9.geometry} material={materials.Tokyo_Ghoul_Eng_9} />
                <mesh geometry={nodes.Object_0012_10.geometry} material={materials.Tokyo_Ghoul_Eng_10} />
                <mesh geometry={nodes.Object_0012_11.geometry} material={materials.Tokyo_Ghoul_Eng_11} />
                <mesh geometry={nodes.Object_0012_12.geometry} material={materials.Tokyo_Ghoul_Eng_12} />
                <mesh geometry={nodes.Object_0012_13.geometry} material={materials.Tokyo_Ghoul_Eng_13} />
                <mesh geometry={nodes.Object_0012_14.geometry} material={materials.Tokyo_Ghoul_Eng_14} />
                <mesh geometry={nodes.usb003.geometry} material={materials.usb} />
                <mesh geometry={nodes.usb003_1.geometry} material={materials.PaletteMaterial003} />
                <mesh geometry={nodes.usb003_2.geometry} material={materials['test-aorus-m2-souris-aorus-rgb2']} />
                <mesh geometry={nodes.usb003_3.geometry} material={materials['rgb-hdd-cover-aorus-v1']} />
                <mesh geometry={nodes.usb003_4.geometry} material={materials.psuback} />
                <mesh geometry={nodes.usb003_5.geometry} material={materials['NVIDIA LOGO']} />
                <mesh geometry={nodes.usb003_6.geometry} material={materials.MOBOAORUSORANGETRANS} />
                <mesh geometry={nodes.usb003_7.geometry} material={materials['metal-mesh-500x500']} />
                <mesh geometry={nodes.usb003_8.geometry} material={materials['maxresdefault (1)']} />
                <mesh geometry={nodes.usb003_9.geometry} material={materials.IOSHIELD} />
                <mesh geometry={nodes.usb003_10.geometry} material={materials['Material.051']} />
                <mesh geometry={nodes.usb003_11.geometry} material={materials['Material.041']} />
                <mesh geometry={nodes.usb003_12.geometry} material={materials['Material.086']} />
                <mesh geometry={nodes.usb003_13.geometry} material={materials['Material.063']} />
                <mesh geometry={nodes.usb003_14.geometry} material={materials['Material.059']} />
                <mesh geometry={nodes.usb003_15.geometry} material={materials.PaletteMaterial004} />
                <mesh geometry={nodes.usb003_16.geometry} material={materials['Material.035']} />
                <mesh geometry={nodes.usb003_17.geometry} material={materials['Material.027']} />
                <mesh geometry={nodes.usb003_18.geometry} material={materials['Material.026']} />
                <mesh geometry={nodes.usb003_19.geometry} material={materials['Material.008']} />
                <mesh geometry={nodes.usb003_20.geometry} material={materials.PaletteMaterial005} />
                <mesh geometry={nodes.usb003_21.geometry} material={materials.PaletteMaterial006} />
                <mesh geometry={nodes.usb003_22.geometry} material={materials['Material.020']} />
                <mesh geometry={nodes.usb003_23.geometry} material={materials['Material.016']} />
                <mesh geometry={nodes.usb003_24.geometry} material={materials['aorus logotranspa']} />
                <mesh geometry={nodes.usb003_25.geometry} material={materials['aorus case fans']} />
                <mesh geometry={nodes.usb003_26.geometry} material={materials['Material.052']} />
                <mesh geometry={nodes.usb003_27.geometry} material={materials['Material.038']} />
                <mesh geometry={nodes.usb003_28.geometry} material={materials['Material.022']} />
                <mesh geometry={nodes.Cube072.geometry} material={materials.ParquetTable} />
                <mesh geometry={nodes.Cube072_1.geometry} material={materials.ParquetTableSides} />
                <mesh geometry={nodes.Object_0010.geometry} material={materials.Rakovina} />
                <mesh geometry={nodes.Object_0010_1.geometry} material={materials.Material} />
                <mesh geometry={nodes.Object_2004.geometry} material={materials.StingrayPBS4SG} />
                <mesh geometry={nodes.Object_2004_1.geometry} material={materials.StingrayPBS5SG} />
                <mesh geometry={nodes.Object_3003.geometry} material={materials.bark} />
                <mesh geometry={nodes.Object_3003_1.geometry} material={materials.foliage} />
                <mesh geometry={nodes.Object_3003_2.geometry} material={materials.fruit} />
                <mesh geometry={nodes.LONG_skinny_1_mesh_hedge_dom_creame_0001.geometry} material={materials.dom_creame} />
                <mesh geometry={nodes.LONG_skinny_1_mesh_hedge_dom_creame_0001_1.geometry} material={materials.model} />
            </group>
        </primitive>
    );
});

export default Model;

// Don't forget to preload Draco decoder
useGLTF.preload('/Models/house-transformed.glb');
