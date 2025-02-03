import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import App from "./App.js";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
    <Canvas
        camera={
            {
                // fov: 45,
                // near: 0.1,
                // far: 200,
                // position: [0, 0, 1],
            }
        }
    >
        <App />
    </Canvas>
);
