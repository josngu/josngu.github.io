import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls} from '@three-ts/orbit-controls';
import test from '../images/box-orthographic-graphics.svg';

// Render the three.js scene as a component
const BoxModel = () => {
  // This div element is of type HTMLDivElement so that the .appendChild method would work
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create scene
    const scene = new THREE.Scene();

    // Create camera
    const viewPortHeight = 720;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / viewPortHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create the renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, viewPortHeight);
    renderer.setClearColor(new THREE.Color(0xffffff));

    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }

    // Create cube geometry
    const geometry = new THREE.BoxGeometry(3, 6, 1.5);

    // Create texture loader
    const textureLoader = new THREE.TextureLoader();

    // Load textures
    const frontTexture = textureLoader.load(test);
    const backTexture = textureLoader.load(test);
    const leftTexture = textureLoader.load(test);
    const rightTexture = textureLoader.load(test);
    const topTexture = textureLoader.load(test);
    const bottomTexture = textureLoader.load(test);

    // Enable anisotropic filtering
    frontTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    backTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    leftTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    rightTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    topTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    bottomTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Create a material for each side of the cube
    const frontMaterial = new THREE.MeshStandardMaterial({ map: frontTexture });
    const backMaterial = new THREE.MeshStandardMaterial({ map: backTexture });
    const leftMaterial = new THREE.MeshStandardMaterial({ map: leftTexture });
    const rightMaterial = new THREE.MeshStandardMaterial({ map: rightTexture });
    const topMaterial = new THREE.MeshStandardMaterial({ map: topTexture });
    const bottomMaterial = new THREE.MeshStandardMaterial({ map: bottomTexture });

    // Create a cube and add the materials to each face
    const cube = new THREE.Mesh(geometry, [
      frontMaterial,
      backMaterial,
      leftMaterial,
      rightMaterial,
      topMaterial,
      bottomMaterial
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

