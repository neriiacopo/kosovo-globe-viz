import { OrbitControls, Bounds, useBounds } from "@react-three/drei";
import { levaStore, useControls } from "leva";
import PointsSprite from "./PointsSprite.js";
import PointsFrame from "./PointsFrame.js";
import { useStore } from "./store/useStore.jsx";

export default function App() {
    const size = useControls("", {
        size: {
            value: 0.5,
            min: 0.3,
            max: 1,
        },
    });

    const toggles = useControls("", {
        sprite: false,
        harmonic: true,
        archive: true,
        clouds: true,
    });

    return (
        <>
            <OrbitControls
                makeDefault
                enablePan={false}
            />
            <Bounds
                fit
                clip
                observe
                margin={1.1}
            >
                <SelectToZoom>
                    <PointsSprite
                        size={size.size}
                        sprite={toggles.sprite}
                        harmonic={toggles.harmonic}
                        clouds={toggles.clouds}
                        archive={toggles.archive}
                    />
                    {!toggles.sprite && toggles.archive && (
                        <PointsFrame
                            size={size.size}
                            harmonic={toggles.harmonic}
                        />
                    )}
                </SelectToZoom>
            </Bounds>
        </>
    );
}

function SelectToZoom({ children }) {
    const api = useBounds();

    const handleClick = (e) => {
        e.stopPropagation();
        e.delta <= 2 && api.refresh(e.object).fit();
    };

    const handleMiss = (e) => {
        e.button === 0 && api.refresh().fit();

        useStore.setState({ active: "" });
    };

    return (
        <group
            onClick={handleClick}
            onPointerMissed={handleMiss}
        >
            {children}
        </group>
    );
}
