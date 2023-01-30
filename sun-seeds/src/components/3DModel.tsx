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
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / viewPortHeight, 0.1, 1000);
    camera.position.z = 10;
    scene.add(camera);

    // Create fog
    scene.fog = new THREE.FogExp2(0xffffff, 0.01);

    // Create the renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, viewPortHeight);
    renderer.setClearColor(new THREE.Color(0xffffff));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
    const textures = [frontTexture, backTexture, leftTexture, rightTexture, topTexture, bottomTexture];
    for (const texture of textures) {
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    }

    // Create a material for each side of the cube
    const frontMaterial = new THREE.MeshPhysicalMaterial({ map: frontTexture });
    const backMaterial = new THREE.MeshPhysicalMaterial({ map: backTexture });
    const leftMaterial = new THREE.MeshPhysicalMaterial({ map: leftTexture });
    const rightMaterial = new THREE.MeshPhysicalMaterial({ map: rightTexture });
    const topMaterial = new THREE.MeshPhysicalMaterial({ map: topTexture });
    const bottomMaterial = new THREE.MeshPhysicalMaterial({ map: bottomTexture });

    // Adjust the roughness of each material
    const roughness = [frontMaterial, backMaterial, leftMaterial, rightMaterial, topMaterial, bottomMaterial];
    for (const specular of roughness) {
      specular.roughness = 0.66;
    }

    // Create a cube and add the materials to each face
    const cube = new THREE.Mesh(geometry, [
      frontMaterial,
      backMaterial,
      topMaterial,
      bottomMaterial,
      leftMaterial,
      rightMaterial
    ]);

    // Have the cube cast and receive shadows
    cube.castShadow = true;
    cube.receiveShadow = true;

    // Add the cube to the scene
    scene.add(cube);

    // Add a plane to the scene
    const planeGeometry = new THREE.PlaneGeometry( 512, 512, 32, 32 );
    const planeMaterial = new THREE.MeshPhysicalMaterial({ color: 0xBBBBBB })
    planeMaterial.roughness = 0.66;
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / -2;
    plane.position.set(0, -3, 0);
    plane.receiveShadow = true;
    scene.add(plane);

    // Add a light
    const hemisphereLight = new THREE.HemisphereLight(0xFFFFFF, 1);
    hemisphereLight.position.set(0, 0, 0);
    scene.add(hemisphereLight);
    
    // Add another light
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.75);
    scene.add(directionalLight);
    directionalLight.position.set(2, 1.5, 1);

    // Cast shadows
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;

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

