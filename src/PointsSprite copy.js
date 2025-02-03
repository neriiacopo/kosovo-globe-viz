import * as THREE from "three";
import { useLayoutEffect, useState, useMemo } from "react";
import { Html } from "@react-three/drei";
import { useStore } from "./store/useStore.jsx";

export default function Points({ layer = "built", size = 1 }) {
    const [db, setDb] = useState([]);

    const active = useStore((state) => state.active);

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

    const fontSize = useMemo(() => size * 8 + "px", [size]);

    useLayoutEffect(() => {
        getJSON();
    }, [layer]);

    return (
        <>
            {db.map(function f(obj, index) {
                return (
                    <sprite
                        key={obj.id}
                        position={obj.point}
                        scale={size}
                        name={obj.name}
                    >
                        <spriteMaterial map={obj.texture} />
                        {obj.name == active && (
                            <Html
                                // position={[0, -size / 2, 0]}
                                position={[0, 0, 0]}
                                wrapperClass="label"
                                center
                                distanceFactor={8}
                                style={{
                                    fontSize: fontSize,
                                    padding:
                                        1 * size +
                                        "px " +
                                        3 * size +
                                        "px " +
                                        1 * size +
                                        "px " +
                                        3 * size +
                                        "px",
                                }}
                            >
                                {obj.name}
                            </Html>
                        )}
                    </sprite>
                );
            })}
        </>
    );
}
