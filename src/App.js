import { OrbitControls, Bounds, useBounds } from "@react-three/drei";
import { levaStore, useControls } from "leva";
import PointsSprite from "./PointsSprite.js";
import { useStore } from "./store/useStore.jsx";

export default function App() {
    const size = useControls("", {
        size: {
            value: 0.5,
            min: 0.3,
            max: 1,
        },
    });

    const harmonic = useControls("", {
        regular: false,
    });

    const clouds = useControls("", {
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
                        harmonic={harmonic.regular}
                        clouds={clouds.clouds}
                    />
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
