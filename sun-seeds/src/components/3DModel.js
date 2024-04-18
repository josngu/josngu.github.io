"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const THREE = __importStar(require("three"));
const orbit_controls_1 = require("@three-ts/orbit-controls");
const box_top_webp_1 = __importDefault(require("../images/box-top.webp"));
const box_bottom_webp_1 = __importDefault(require("../images/box-bottom.webp"));
const box_left_webp_1 = __importDefault(require("../images/box-left.webp"));
const box_right_webp_1 = __importDefault(require("../images/box-right.webp"));
const box_front_webp_1 = __importDefault(require("../images/box-front.webp"));
const box_back_webp_1 = __importDefault(require("../images/box-back.webp"));
// Render the three.js scene as a component
const BoxModel = () => {
    // This div element is of type HTMLDivElement so that the .appendChild method would work
    const containerRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        // Create scene
        const scene = new THREE.Scene();
        // Create camera
        let viewPortHeight = window.innerHeight;
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / viewPortHeight, 0.1, 1000);
        camera.position.x = 6;
        camera.position.y = 4;
        camera.position.z = 3;
        scene.add(camera);
        // Create fog
        scene.fog = new THREE.FogExp2(0xffffff, 0.01);
        // Create the renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        // Set background colour
        renderer.setClearColor(new THREE.Color(0xffffff));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.VSMShadowMap;
        if (containerRef.current) {
            containerRef.current.appendChild(renderer.domElement);
        }
        // Create cube geometry
        const geometry = new THREE.BoxGeometry(1.5, 6, 3);
        // Create texture loader
        const textureLoader = new THREE.TextureLoader();
        // Load textures
        const frontTexture = textureLoader.load(box_front_webp_1.default);
        const backTexture = textureLoader.load(box_back_webp_1.default);
        const leftTexture = textureLoader.load(box_left_webp_1.default);
        const rightTexture = textureLoader.load(box_right_webp_1.default);
        const topTexture = textureLoader.load(box_top_webp_1.default);
        const bottomTexture = textureLoader.load(box_bottom_webp_1.default);
        // Enable anisotropic filtering
        const textures = [
            frontTexture,
            backTexture,
            leftTexture,
            rightTexture,
            topTexture,
            bottomTexture,
        ];
        for (const texture of textures) {
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        }
        // Create a material for each side of the cube
        const frontMaterial = new THREE.MeshPhysicalMaterial({ map: frontTexture });
        const backMaterial = new THREE.MeshPhysicalMaterial({ map: backTexture });
        const leftMaterial = new THREE.MeshPhysicalMaterial({ map: leftTexture });
        const rightMaterial = new THREE.MeshPhysicalMaterial({ map: rightTexture });
        const topMaterial = new THREE.MeshPhysicalMaterial({ map: topTexture });
        const bottomMaterial = new THREE.MeshPhysicalMaterial({
            map: bottomTexture,
        });
        // Adjust the roughness of each material
        const roughness = [
            frontMaterial,
            backMaterial,
            leftMaterial,
            rightMaterial,
            topMaterial,
            bottomMaterial,
        ];
        for (const specular of roughness) {
            specular.roughness = 0.5;
        }
        // Create a cube and add the materials to each face
        const cube = new THREE.Mesh(geometry, [
            frontMaterial,
            backMaterial,
            topMaterial,
            bottomMaterial,
            leftMaterial,
            rightMaterial,
        ]);
        // Have the cube cast and receive shadows
        cube.castShadow = true;
        cube.receiveShadow = true;
        // Add the cube to the scene
        scene.add(cube);
        // Add the ground + shadows
        const planeGround = new THREE.Mesh(new THREE.PlaneGeometry(512, 512, 1, 1), new THREE.ShadowMaterial({
            color: 0x000000,
            opacity: 0.5,
        }));
        planeGround.rotation.x = Math.PI / -2;
        planeGround.position.set(0, -3, 0);
        planeGround.receiveShadow = true;
        scene.add(planeGround);
        // Add hemisphere light
        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 1);
        hemisphereLight.position.set(0, 0, 0);
        scene.add(hemisphereLight);
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
        camera.add(directionalLight);
        //camera.add(directionalLightHelper);
        directionalLight.position.set(8, 8, 8);
        // Cast shadows
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.bias = -0.0001;
        directionalLight.shadow.camera.right = 16;
        directionalLight.shadow.camera.left = -16;
        directionalLight.shadow.camera.top = 16;
        directionalLight.shadow.camera.bottom = -16;
        directionalLight.shadow.camera.near = 0.01;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.blurSamples = 16;
        directionalLight.shadow.radius = 4;
        // Add spotlight
        const spotLight = new THREE.SpotLight(0xffffff, 1);
        const spotLightHelper = new THREE.SpotLightHelper(spotLight, 1);
        //scene.add(spotLight);
        //scene.add(spotLightHelper);
        spotLight.position.set(4, 4, 0);
        spotLight.angle = Math.PI / 4;
        spotLight.penumbra = 0.2;
        // Cast shadows
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        spotLight.shadow.bias = -0.0001;
        spotLight.shadow.camera.near = 1;
        spotLight.shadow.camera.far = 500;
        spotLight.shadow.blurSamples = 16;
        spotLight.shadow.radius = 8;
        // Add orbit controls
        const orbitControls = new orbit_controls_1.OrbitControls(camera, renderer.domElement);
        // Smooth rotate controls
        orbitControls.enableDamping = true;
        orbitControls.dampingFactor = 0.05;
        orbitControls.rotateSpeed = 0.1;
        // Autorotate
        orbitControls.autoRotate = false; // Default: true
        orbitControls.autoRotateSpeed = 0.1;
        // Animate the scene
        const animate = () => {
            orbitControls.update();
            // Dynamically resize everything proportionally when the user resizes their window
            camera.aspect = window.innerWidth / (window.innerHeight - 105);
            renderer.setSize(window.innerWidth, window.innerHeight - 105);
            camera.updateProjectionMatrix();
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();
        return () => {
            // Removes the second canvas that is created for some reason
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);
    return <div ref={containerRef}/>;
};
exports.default = BoxModel;
