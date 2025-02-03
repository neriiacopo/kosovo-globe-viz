import * as THREE from "three";
import { useLayoutEffect, useState, useMemo } from "react";
import { Html } from "@react-three/drei";
import { useStore } from "./store/useStore.jsx";
import { useFrame } from "@react-three/fiber";

export default function Points({
    size = 1,
    sprite = false,
    harmonic = false,
    clouds = true,
    archive = true,
}) {
    const [db, setDb] = useState([]);
    const [dbclouds, setDbClouds] = useState([]);

    const r1 = 2;
    const r2 = 1.8;

    const active = useStore((state) => state.active);

    async function makeMainSprites() {
        // Clean fetching API
        const response = await fetch("./data.json");
        const result = await response.json();

        const db = [];

        for (let i = 0; i < result.length; i++) {
            const path = result[i].path;

            const texture = new THREE.TextureLoader().load(path);

            // get aspect ratio
            const image = new Image();
            image.src = path;
            await image.decode();
            const aspectRatio = image.width / image.height;

            const phi = Math.acos(2 * Math.random() - 1);
            const theta = Math.random() * Math.PI * 2;

            const posRandom = [
                r1 * Math.sin(phi) * Math.cos(theta),
                r1 * Math.sin(phi) * Math.sin(theta),
                r1 * Math.cos(phi),
            ];

            const posGrid = result[i].regular;

            const obj = {
                id: i,
                posRandom: posRandom,
                posGrid: posGrid,
                texture: texture,
                aspectRatio: aspectRatio,
            };

            db.push(obj);
        }

        setDb(db);
    }

    async function makeSecSprites() {
        const cloud_links = [
            "./clouds/c1.jpg",
            "./clouds/c2.jpg",
            "./clouds/c3.jpg",
            "./clouds/c4.png",
        ];

        const db = [];

        for (let i = 0; i < cloud_links.length; i++) {
            const path = cloud_links[i];
            const texture = new THREE.TextureLoader().load(path);

            // Load image to get dimensions
            const image = new Image();
            image.src = path;
            await image.decode();
            const aspectRatio = image.width / image.height;

            // Set random zoom level (1 = full image, higher values zoom in)
            const zoom = THREE.MathUtils.randFloat(1.5, 3);

            // Generate a random texture offset
            const xOffset = THREE.MathUtils.randFloat(0, 1 - 1 / zoom);
            const yOffset = THREE.MathUtils.randFloat(0, 1 - 1 / zoom);

            // Apply zoom effect to texture
            texture.repeat.set(1 / zoom, 1 / zoom);
            texture.offset.set(xOffset, yOffset);
            texture.needsUpdate = true; // Ensure Three.js updates the texture

            for (let j = 0; j < Math.random() * 30; j++) {
                const phi = Math.acos(2 * Math.random() - 1);
                const theta = Math.random() * Math.PI * 2;

                const positions = [
                    r2 * Math.sin(phi) * Math.cos(theta),
                    r2 * Math.sin(phi) * Math.sin(theta),
                    r2 * Math.cos(phi),
                ];

                const obj = {
                    id: i * 10 + j,
                    point: positions,
                    texture: texture,
                    aspectRatio: aspectRatio,
                    zoom: zoom, // Store zoom level for debugging
                    material: new THREE.SpriteMaterial({
                        map: texture,
                        transparent: true,
                    }),
                };

                db.push(obj);
            }
        }

        setDbClouds(db);
    }

    useLayoutEffect(() => {
        makeMainSprites();
        makeSecSprites();
    }, [archive]);

    useFrame(({ camera }) => {
        setDbClouds((prevDbClouds) =>
            prevDbClouds.map((obj) => {
                const distance = camera.position.distanceTo(
                    new THREE.Vector3(...obj.point)
                );
                const opacity = THREE.MathUtils.clamp(
                    1.5 - distance / 3,
                    0.0,
                    2
                );

                obj.material.opacity = opacity; // Update material opacity

                return obj;
            })
        );
    });

    return (
        <>
            {archive &&
                sprite &&
                db.map(function f(obj, index) {
                    return (
                        <sprite
                            key={obj.id}
                            position={harmonic ? obj.posGrid : obj.posRandom}
                            scale={[size * obj.aspectRatio, size, 1]}
                            name={obj.name}
                        >
                            <spriteMaterial map={obj.texture} />
                        </sprite>
                    );
                })}
            {clouds &&
                dbclouds.map(function f(obj, index) {
                    return (
                        <sprite
                            key={obj.id}
                            position={obj.point}
                            scale={[
                                size * 0.7 * obj.aspectRatio,
                                size * 0.7,
                                1,
                            ]}
                            name={obj.name}
                        >
                            <primitive object={obj.material} />
                        </sprite>
                    );
                })}
        </>
    );
}
