import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// SCENE
const scene = new THREE.Scene();

// CAMERA
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0x000000);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// document.documentElement.style.overflow = 'hidden';

// ORBIT CONTROLS
// three/examples/jsm is the correct path for this version of Three.js
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// PARTICLES
const PARTICLE_COUNT = 2000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(PARTICLE_COUNT * 3);
const originalPositions = new Float32Array(PARTICLE_COUNT * 3);

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const index = i * 3;
  const x = (Math.random() - 0.5) * 10;
  const y = (Math.random() - 0.5) * 10;
  const z = (Math.random() - 0.5) * 10;

  positions[index] = x;
  positions[index + 1] = y;
  positions[index + 2] = z;

  originalPositions[index] = x;
  originalPositions[index + 1] = y;
  originalPositions[index + 2] = z;
}

geometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
);

// CIRCLE TEXTURE
function createCircleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.arc(32, 32, 30, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  return new THREE.CanvasTexture(canvas);
}

// MATERIAL
const material = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.05,
  map: createCircleTexture(),
  transparent: true,
  depthWrite: false,
});

// POINTS
const particles = new THREE.Points(geometry, material);
scene.add(particles);

// ELAPSED TIME TRACKER
// performance.now() returns milliseconds since the page loaded
// We divide by 1000 to convert to seconds
// This is exactly what THREE.Clock and THREE.Timer do internally
// startTime captures the moment the app began so we can calculate elapsed time
const startTime = performance.now();

// ANIMATE
function animate() {
  requestAnimationFrame(animate);

  // Calculate how many seconds have passed since the app started
  // performance.now() is always increasing, subtracting startTime gives elapsed ms
  // Dividing by 1000 converts ms to seconds
  const elapsedTime = (performance.now() - startTime) / 1000;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const index = i * 3;

    // Each particle gets a unique phase offset so they do not all move in sync
    const offset = index * 0.5;

    positions[index] = originalPositions[index] + Math.sin(elapsedTime + offset) * 0.3;
    positions[index + 1] = originalPositions[index + 1] + Math.cos(elapsedTime + offset) * 0.3;
    positions[index + 2] = originalPositions[index + 2] + Math.sin(elapsedTime + offset * 0.5) * 0.3;
  }

  // Tell the GPU the position data changed this frame
  geometry.attributes.position.needsUpdate = true;

  // OrbitControls damping requires update every frame
  controls.update();

  renderer.render(scene, camera);
}

animate();

// RESIZE HANDLER
window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});