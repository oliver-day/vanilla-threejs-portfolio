import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // OrbitControls is not part of the core library, so we need to import it separately
import './style.css';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, // Field of view
  window.innerWidth / window.innerHeight, // aspect ratio based on user's browser screen
  0.1, // view frustum
  1000
);

const renderer = new THREE.WebGLRenderer({
 canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight); // set size of canvas to be full screen
camera.position.setZ(30); // move camera back 30 units

renderer.render(scene, camera); // render scene and camera

// Create a 3D ring
const geometry = new THREE.TorusGeometry(10, 3, 16, 100); // radius, tube, radialSegments, tubularSegments
const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 }); // color of ring 
const torus = new THREE.Mesh(geometry, material); // create mesh by combining geometry with the material
scene.add(torus); // add 3D ring to scene

// Create a point light
const pointLight = new THREE.PointLight(0xffffff); // set color of light to white
pointLight.position.set(5, 5, 5); // set position of light
scene.add(pointLight); // add light to scene

// Create an ambient light
const ambientLight = new THREE.AmbientLight(0xffffff); // set color of light to white
scene.add(ambientLight); // add light to scene

// Create a light helper
const lightHelper = new THREE.PointLightHelper(pointLight); // show light source
scene.add(lightHelper); // add light helper to scene

// Create a grid helper
const gridHelper = new THREE.GridHelper(200, 50); // size of grid, number of divisions
scene.add(gridHelper); // add grid helper to scene

// OrbitControls allows us to move around the scene with our mouse
const controls = new OrbitControls(camera, renderer.domElement);

// Create a background
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24); // radius, widthSegments, heightSegments
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff }); // color of star
  const star = new THREE.Mesh(geometry, material); // create mesh by combining geometry with the material

  // Randomly position stars in the scene
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100)); // create array of 3 random numbers between -100 and 100
  star.position.set(x, y, z); // set position of star
  scene.add(star); // add star to scene
}

Array(200).fill().forEach(addStar); // create 200 stars

// Create a background image
const spaceTexture = new THREE.TextureLoader().load('space.jpeg');
scene.background = spaceTexture;

// Create a 3D avatar
const avatarTexture = new THREE.TextureLoader().load('avatar.jpg');
const avatar = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3), // width, height, depth
  new THREE.MeshBasicMaterial({ map: avatarTexture }) // map texture to material
);
scene.add(avatar); // add avatar to scene

// Create a 3D moon
const moonTexture = new THREE.TextureLoader().load('moon.jpeg');
const normalTexture = new THREE.TextureLoader().load('normal.jpeg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32), // radius, widthSegments, heightSegments
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture, // add normal map to give moon texture
  }) // map texture to material
);
scene.add(moon); // add moon to scene
moon.position.z = 30; // move moon back 30 units
moon.position.setX(-10); // move moon left 10 units

function moveCamera() {
  const t = document.body.getBoundingClientRect().top; // get distance between top of browser screen and top of body element
  moon.rotation.x += 0.05; // rotate moon on x-axis
  moon.rotation.y += 0.075; // rotate moon on y-axis
  moon.rotation.z += 0.05; // rotate moon on z-axis

  avatar.rotation.y += 0.01; // rotate avatar on y-axis
  avatar.rotation.z += 0.01; // rotate avatar on z-axis

  camera.position.z = t * -0.01; // move camera back 0.01 units for every pixel that we scroll down
  camera.position.x = t * -0.0002; // move camera left 0.0002 units for every pixel that we scroll down
  camera.rotation.y = t * -0.0002; // rotate camera on y-axis for every pixel that we scroll down
}
document.body.onscroll = moveCamera; // call moveCamera function when user scrolls

function animate() {
  requestAnimationFrame(animate); // tells the browser to perform an animation
  torus.rotation.x += 0.01; // rotate ring on x-axis
  torus.rotation.y += 0.005; // rotate ring on y-axis
  torus.rotation.z += 0.01; // rotate ring on z-axis

  controls.update(); // ensure that any changes made to the camera position are updated when we move around the scene

  renderer.render(scene, camera);
}

animate(); // call animate function
