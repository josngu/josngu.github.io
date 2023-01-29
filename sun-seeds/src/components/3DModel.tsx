import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls} from '@three-ts/orbit-controls';
import boxTop from '../images/box-top.webp';
import boxBottom from '../images/box-bottom.webp';
import boxLeft from '../images/box-left.webp';
import boxRight from '../images/box-right.webp';
import boxFront from '../images/box-front.webp';
import boxBack from '../images/box-back.webp';


// Render the three.js scene as a component
const BoxModel = () => {
  // This div element is of type HTMLDivElement so that the .appendChild method would work
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create scene
    const scene = new THREE.Scene();

    // Create camera
    const viewPortHeight = 720;
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / viewPortHeight, 0.1, 1000);
    camera.position.z = 10;

    // Create the renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, viewPortHeight);
    renderer.setClearColor(new THREE.Color(0xffffff));

    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }

    // Create cube geometry
    const geometry = new THREE.BoxGeometry(1.5, 6, 3);

    // Create texture loader
    const textureLoader = new THREE.TextureLoader();

    // Load textures
    const frontTexture = textureLoader.load(boxFront);
    const backTexture = textureLoader.load(boxBack);
    const leftTexture = textureLoader.load(boxLeft);
    const rightTexture = textureLoader.load(boxRight);
    const topTexture = textureLoader.load(boxTop);
    const bottomTexture = textureLoader.load(boxBottom);

    // Enable anisotropic filtering
    frontTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    backTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    leftTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    rightTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    topTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    bottomTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Create a material for each side of the cube
    const frontMaterial = new THREE.MeshPhysicalMaterial({ map: frontTexture });
    const backMaterial = new THREE.MeshPhysicalMaterial({ map: backTexture });
    const leftMaterial = new THREE.MeshPhysicalMaterial({ map: leftTexture });
    const rightMaterial = new THREE.MeshPhysicalMaterial({ map: rightTexture });
    const topMaterial = new THREE.MeshPhysicalMaterial({ map: topTexture });
    const bottomMaterial = new THREE.MeshPhysicalMaterial({ map: bottomTexture });

    // Create a cube and add the materials to each face
    const cube = new THREE.Mesh(geometry, [
      frontMaterial,
      backMaterial,
      topMaterial,
      bottomMaterial,
      leftMaterial,
      rightMaterial
    ]);
    // Add the cube to the scene
    scene.add(cube);

    // Add a light
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
    scene.add(ambientLight);

    // Add orbit controls
    const orbitControls = new OrbitControls(camera, renderer.domElement);

    // Animate the scene
    const animate = () => {
      requestAnimationFrame(animate);
 
      renderer.render(scene, camera);
    };
    animate();
    return () => {
      // Cleanup function
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    }
  }, []);

  return <div ref={containerRef} />;
};

export default BoxModel;

