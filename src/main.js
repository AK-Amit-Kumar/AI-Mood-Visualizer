import * as THREE from 'three';

//Scene - empty 3D space that holds everything
const scene = new THREE.Scene()

//Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 5;

//RENEDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0x000000);
renderer.setSize(window.innerWidth, window.innerHeight);

//Creating Round Particles
function createCircleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;

  const ctx = canvas.getContext('2d');

  ctx.beginPath();

  ctx.arc(32, 32, 30, 0, Math.PI * 2);

  ctx.fillStyle = 'white';
  ctx.fill()

  return new THREE.CanvasTexture(canvas);
}

document.body.appendChild(renderer.domElement);

//PARTICLES 
const PARTICLE_COUNT = 2000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(PARTICLE_COUNT * 3);

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const index = i * 3;

  positions[index] = (Math.random() - 0.5) * 10;
  positions[index + 1] = (Math.random() - 0.5) * 10;
  positions[index + 2] = (Math.random() - 0.5) * 10;
}

geometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
);

const material = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.05,
  map: createCircleTexture(),
  transparent: true,
  depthWrite: false,
});

const particles = new THREE.Points(geometry, material);

scene.add(particles);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix(); //recaliberating the camera lens 

  renderer.setSize(window.innerWidth, window.innerHeight);
});
