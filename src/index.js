import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

// import bg from "./newsroom-collage.png";
import bg from "./Amortentia.jpeg";
import bg1 from "./lipstick.jpeg";

const mousePosition = new THREE.Vector2();
window.addEventListener("mousemove", (e) => {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = (e.clientY / window.innerHeight) * 2 + 1;
});

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const orbit = new OrbitControls(camera, renderer.domElement);
const axesHelper = new THREE.AxesHelper(3); // shows axis
scene.add(axesHelper);

camera.position.set(-10, 30, 30);
orbit.update();

// creates box
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

// creates plane
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide, // makes plane appear on both sides of the grid
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI; // flatten plane to match grid
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(30); // grid
scene.add(gridHelper);

const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const plane2Material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
  // side: THREE.DoubleSide, // makes plane appear on both sides of the grid
});
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(10, 10, 15);

console.log(plane2.geometry.attributes.position.array);
plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
plane2.geometry.attributes.position.array[2] -= 10 * Math.random();
const lastpointz = plane2.geometry.attributes.position.array.length - 1;
plane2.geometry.attributes.position.array[lastpointz] -= 10 * Math.random();

// creates sphere
const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x0000ff,
  //   wireframe: true, // shows skeleton
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 10, 0);
sphere.castShadow = true;
const sphereId = sphere.id;

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// 2
const vshader = `
  void main(){
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position * 1.0)
  }
`;
const fshader = `
  void main(){
    gl_FragColor =  vec4(0.5,0.5,1.0,1.0)
  }
`;
const sphere2Geometry = new THREE.SphereGeometry(4, 50, 50);
const sphere2Material = new THREE.ShaderMaterial({
  vertexShader: vshader,
  fragmentShader: fshader,
});
const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
scene.add(sphere2);
sphere2.position.set(-5, 10, 10);

// directional light
// const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true;

// const DLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(DLightHelper);

// const DLightShadowHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );
// scene.add(DLightShadowHelper);
// directionalLight.shadow.camera.bottom = -12;

// spotlight

const spotlight = new THREE.SpotLight(0xffffff);
scene.add(spotlight);
spotlight.position.set(-50, 100, 0);
spotlight.decay = 0;
spotlight.castShadow = true;
spotlight.angle = 0.2;

const spotlightHelper = new THREE.SpotLightHelper(spotlight);
scene.add(spotlightHelper);

// scene.fog = new THREE.FogExp2(0xffffff, 0.01);

const textureloader = new THREE.TextureLoader();
scene.background = textureloader.load(bg);

const cubetextureloader = new THREE.CubeTextureLoader();
// scene.background = cubetextureloader.load([bg, bg, bg1, bg1, bg, bg]);

// creates box 2
const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshBasicMaterial({
  map: textureloader.load(bg1),
});

const box2MultiMaterial = [
  new THREE.MeshBasicMaterial({
    map: textureloader.load(bg),
  }),
  new THREE.MeshBasicMaterial({
    map: textureloader.load(bg1),
  }),
  new THREE.MeshBasicMaterial({
    map: textureloader.load(bg),
  }),
  new THREE.MeshBasicMaterial({
    map: textureloader.load(bg1),
  }),
  new THREE.MeshBasicMaterial({
    map: textureloader.load(bg),
  }),
  new THREE.MeshBasicMaterial({
    map: textureloader.load(bg1),
  }),
];
const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial);
scene.add(box2);
box2.position.set(0, 15, 10);
box2.name = "theBox";

const gui = new dat.GUI();
const options = {
  sphereColor: "#ffea00",
  wireframe: false,
  speed: 0.01,
  angle: 0.2,
  penumbra: 0.01,
  intensity: 0.1,
};
gui.addColor(options, "sphereColor").onChange((e) => {
  console.log(e);
  sphere.material.color.set(e);
});
gui.add(options, "wireframe").onChange((e) => {
  sphere.material.wireframe = e;
});
gui.add(options, "speed", 0, 0.1);
gui.add(options, "angle", 0, 1);
gui.add(options, "penumbra", 0, 1);
gui.add(options, "intensity", 0, 1);

let step = 0;

const raycaster = new THREE.Raycaster();
const animate = () => {
  box.rotation.x += 0.01;
  box.rotation.y += 0.01;

  //   DONT WORK
  //   directionalLight.angle = options.angle;
  //   directionalLight.intensity = options.intensity;
  //   directionalLight.penumbra = options.penumbra;
  //   DLightHelper.update();

  spotlight.angle = options.angle;
  spotlight.intensity = options.intensity;
  spotlight.penumbra = options.penumbra;
  spotlightHelper.update();

  step += options.speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step));

  raycaster.setFromCamera(mousePosition, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  // console.log(intersects);

  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.id === sphereId) {
      intersects[i].object.material.color.set(0xff0000);
    }
    if (intersects[i].object.name === "theBox") {
      intersects[i].object.rotation.x += 0.01;
      intersects[i].object.rotation.y += 0.01;
    }
  }

  plane2.geometry.attributes.position.array[0] = 10 * Math.random();
  plane2.geometry.attributes.position.array[1] = 10 * Math.random();
  plane2.geometry.attributes.position.array[2] = 10 * Math.random();
  plane2.geometry.attributes.position.array[lastpointz] = 10 * Math.random();
  plane2.geometry.attributes.position.needsUpdate = true;
  renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate); // animation
