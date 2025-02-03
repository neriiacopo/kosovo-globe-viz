import * as THREE from "three";
import { useEffect, useState } from "react";
import { Html } from "@react-three/drei";

export default function Points({ layer = "built", size = 1, label = false }) {
    const [db, setDb] = useState([]);

    async function getJSON() {
        // Clean fetching API
        const response = await fetch("./json/" + layer + "_3D.json");
        const result = await response.json();

        const db = [];

        let points = [];
        let paths = [];
        let iter = 0;

        for (let i = 0; i < result.length; i++) {
            const positions = [...Array(3)];
            const p = result[i];
            const path = result[i].path;
            const meta = path.split("/")[3].split(".")[0].split("_");

            const texture = new THREE.TextureLoader().load(path);

            for (let j = 0; j < 3; j++) {
                positions[j] = (p.point[j] - 0.5) * 50;
            }

            const obj = {
                id: meta[1],
                name: meta[2],
                point: positions,
                texture: texture,
            };

            db.push(obj);
        }

        setDb(db);
    }

    useEffect(() => {
        getJSON();
    }, [layer]);

    return (
        <>
            <group>
                {db.map(function f(obj, index) {
                    return (
                        <mesh
                            key={obj.id}
                            position={obj.point}
                            scale={size}
                        >
                            <planeGeometry args={[1, 1]} />
                            <meshBasicMaterial map={obj.texture} />

                            {label && (
                                <Html
                                    position={[0, 0, 0]}
                                    wrapperClass="label"
                                    center
                                    // distanceFactor={8}
                                >
                                    {obj.name}
                                </Html>
                            )}
                        </mesh>
                    );
                })}
            </group>
        </>
    );
}
