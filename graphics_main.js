// Winston Palace
// Based off of https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API

import {drawScene} from "./draw-scene.js";
import {createMeshFromOBJ} from "./objImporter.js";
import {createMeshFromFMR} from "./fmrImporter.js";

const canvas = document.querySelector("#canvas");
// Initialize the gl context
const gl = canvas.getContext("webgl");

let deltaTime = 0;

// Load cube Mesh
const cubeMeshFile = await fetch('Assets/Cube.fmr');
const cubeFileText = await cubeMeshFile.text();
//const cubeMesh = createMeshFromOBJ(gl, cubeFileText);
const cubeMesh = createMeshFromFMR(gl, cubeFileText);

// Load hotdawg Mesh
const hotdawgMeshFile = await fetch('Assets/Hotdawg.fmr');
const hotdawgFileText = await hotdawgMeshFile.text();
const hotdawgMesh = createMeshFromFMR(gl, hotdawgFileText);

//Textures
let hotdawgTextureUrl = "Assets/HotdawgDiffuse.png";
let cubeTextureUrl = "Assets/CubeDiffuse.png";
let squareTextureUrl = "Assets/TestTexture.png";

main();

//
// start here
//
function main() {

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);

  let gameObjects = [];

  let cube = new GameObject();
  cube.mesh = cubeMesh;
  cube.shader = SHADERLIST.UNLIT;
  cube.material = new Material(gl, cubeTextureUrl);
  cube.transform.position.x = 10;
  cube.transform.position.y = 6;
  cube.transform.position.z = -40;
  gameObjects.push(cube);


  let hotdawg = new GameObject();
  hotdawg.mesh = hotdawgMesh;
  hotdawg.shader = SHADERLIST.UNLIT;
  hotdawg.material = new Material(gl, hotdawgTextureUrl);
  hotdawg.transform.position.x = -10;
  hotdawg.transform.position.y = 5;
  hotdawg.transform.position.z = -30;
  gameObjects.push(hotdawg);

  const fieldOfView = (45 * Math.PI) / 180; // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;

  const camera = new Camera(fieldOfView, aspect, zNear, zFar);

  let then = 0;

  // Draw the scene repeatedly
  function render(now) {

    //console.log(gl.getError());

    now *= 0.001; // convert to seconds
    deltaTime = now - then;
    then = now;

    //camera.transform.position.z -= 0.1;

    for(let i=0; i<gameObjects.length; i++){
      //gameObjects[i].transform.rotation.x += 1;
      gameObjects[i].transform.rotation.y += 1;
      //gameObjects[i].transform.rotation.z += 1;
    }

    drawScene(gl, gameObjects, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}