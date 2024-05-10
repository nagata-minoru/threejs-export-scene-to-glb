import * as THREE from './three/build/three.module.js';
import { GLTFExporter } from './three/examples/jsm/exporters/GLTFExporter.js';

const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const sphereGeometry = new THREE.SphereGeometry(1, 100, 10);

const material1 = new THREE.MeshBasicMaterial({ color: 'indigo' });
const material2 = new THREE.MeshBasicMaterial({ color: 'blue' });

const mesh1 = new THREE.Mesh(cubeGeometry, material1);
const mesh2 = new THREE.Mesh(sphereGeometry, material2);

scene.add(mesh1, mesh2);

mesh2.scale.set(0.5, 0.5, 0.5);
mesh2.position.set(0, 1, 0);

const btn = document.getElementById('download-glb');
btn.onclick = () => {
  const exporter = new GLTFExporter();
  exporter.parse(scene, function (result) {
    const blob = new Blob([result], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scene.glb';
    link.click();
  });
};

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 1, 2);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

animate();
