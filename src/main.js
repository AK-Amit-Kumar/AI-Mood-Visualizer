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

//MOOD PRESETS 
const moodPresets = {
  happy: {
    color: new THREE.Color(0xffd700),
    speed: 2.0,
    spread: 0.4,
    size: 0.06
  },
  sad: {
    color: new THREE.Color(0x4a90d9),
    speed: 0.4,
    spread: 0.15,
    size: 0.03
  },
  angry: {
    color: new THREE.Color(0xff2200),
    speed: 4.0,
    spread: 0.6,
    size: 0.08
  },
  calm: {
    color: new THREE.Color(0x00c9a7),
    speed: 0.6,
    spread: 0.2,
    size: 0.03
  },
  anxious: {
    color: new THREE.Color(0xff6b6b),
    speed: 3.0,
    spread: 0.35,
    size: 0.05
  },
  excited: {
    color: new THREE.Color(0xbf5fff),
    speed: 3.5,
    spread: 0.5,
    size: 0.06
  }
};

//CURRENT STATE - LIVE VALUES THE PARTICLE SYSTEM USES RIGHT NOW
const currentState = {
  color: new THREE.Color(0x00c9a7),
  speed: 0.6,
  spread: 0.2,
  size: 0.03
};

//TARGET STATE - PARTICLE WHERE IT IS TRYING TO GET 
const targetState = {
  color: new THREE.Color(0x00c9a7),
  speed: 0.6,
  spread: 0.2,
  size: 0.03
};

// lerp (linear interpolation) speed
const LERP_SPEED = 0.05;

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

  //Lerping current state toward target state
  //LERP THE COLOR 
  currentState.color.lerp(targetState.color, LERP_SPEED);

  // LERP THE SPEED, SPREAD, SIZE
  currentState.speed += (targetState.speed - currentState.speed) * LERP_SPEED;
  currentState.spread += (targetState.spread - currentState.spread) * LERP_SPEED;
  currentState.size += (targetState.size - currentState.size) * LERP_SPEED;

  //Applying currentState size to material
  material.color.copy(currentState.color);
  material.size = currentState.size;
  // material.needsUpdate = true;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const index = i * 3;

    // Each particle gets a unique phase offset so they do not all move in sync
    const offset = index * 0.5;

    positions[index] = originalPositions[index] + Math.sin(elapsedTime * currentState.speed + offset) * currentState.spread;
    positions[index + 1] = originalPositions[index + 1] + Math.cos(elapsedTime * currentState.speed + offset) * currentState.spread;
    positions[index + 2] = originalPositions[index + 2] + Math.sin(elapsedTime * currentState.speed + offset * 0.5) * currentState.spread;
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

// MOOD SELECTOR
const moodSelect = document.getElementById('moodSelect')

moodSelect.addEventListener('change', function () {
  const selectedMood = moodSelect.value;

  const preset = moodPresets[selectedMood]

  targetState.color.copy(preset.color);
  targetState.speed = preset.speed;
  targetState.spread = preset.spread;
  targetState.size = preset.size;
});