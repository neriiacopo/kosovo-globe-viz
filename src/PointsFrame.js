import * as THREE from "three";
import { useLayoutEffect, useState } from "react";

export default function PointsFrame({ size = 1, harmonic = true }) {
    const [db, setDb] = useState([]);
    const radius = 2;

    async function loadImages() {
        const response = await fetch("./data.json");
        const result = await response.json();

        const db = [];

        for (let i = 0; i < result.length; i++) {
            const path = result[i].path;
            const texture = new THREE.TextureLoader().load(path);

            const image = new Image();
            image.src = path;
            await image.decode();
            const aspectRatio = image.width / image.height;

            // Spherical coordinates
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = Math.random() * Math.PI * 2;

            const rx = radius - Math.random() * 0.1;

            let position;

            if (harmonic) {
                position = new THREE.Vector3(
                    result[i].regular[0],
                    result[i].regular[1],
                    result[i].regular[2]
                );
            } else {
                position = new THREE.Vector3(
                    rx * Math.sin(phi) * Math.cos(theta),
                    rx * Math.sin(phi) * Math.sin(theta),
                    rx * Math.cos(phi)
                );
            }

            // Compute normal direction
            const normal = position.clone().normalize();

            // Create a basis for alignment
            const up = new THREE.Vector3(0, 1, 0);
            if (Math.abs(normal.dot(up)) > 0.99) {
                up.set(1, 0, 0);
            }
            const tangent = new THREE.Vector3()
                .crossVectors(up, normal)
                .normalize();
            const bitangent = new THREE.Vector3()
                .crossVectors(normal, tangent)
                .normalize();

            const matrix = new THREE.Matrix4();
            matrix.makeBasis(tangent, bitangent, normal);
            matrix.setPosition(position);

            db.push({ id: i, position, texture, aspectRatio, matrix });
        }

        setDb(db);
    }

    useLayoutEffect(() => {
        loadImages();
    }, [harmonic]);

    return (
        <>
            {db.map((obj) => (
                <mesh
                    key={obj.id}
                    matrixAutoUpdate={false}
                >
                    <planeGeometry args={[size * obj.aspectRatio, size]} />
                    <meshBasicMaterial
                        map={obj.texture}
                        side={THREE.DoubleSide}
                        // transparent
                    />
                    <primitive
                        object={obj.matrix}
                        attach="matrix"
                    />
                </mesh>
            ))}
        </>
    );
}
