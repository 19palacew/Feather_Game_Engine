// Winston Palace
// Based off of https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API

import {drawScene} from "./draw-scene.js";
import {createMeshFromOBJ} from "./objImporter.js";
import {createMeshFromMIE} from "./mieImporter.js";

const canvas = document.querySelector("#canvas");
// Initialize the gl context
const gl = canvas.getContext("webgl");

let deltaTime = 0;

// Vertex shader program
const vertexShaderFile = await fetch('Assets/vertexShader.glsl');
const vertexShaderSource = await vertexShaderFile.text();

// Fragment shader program
const fragmentShaderFile = await fetch('Assets/fragmentShader.glsl');
const fragmentShaderSource = await fragmentShaderFile.text();

// Load cube Mesh
const cubeMeshFile = await fetch('Assets/TriangulatedCube.obj');
const cubeFileText = await cubeMeshFile.text();
const cubeMesh = createMeshFromOBJ(gl, cubeFileText);


// Load sphere Mesh
const sphereMeshFile = await fetch('Assets/TriangulatedSphere.obj');
const sphereFileText = await sphereMeshFile.text();
const sphereMesh = createMeshFromOBJ(gl, sphereFileText);

// Load hotdawg Mesh
const hotdawgMeshFile = await fetch('Assets/Hotdawg.mie');
const hotdawgFileText = await hotdawgMeshFile.text();
const hotdawgMesh = createMeshFromMIE(gl, hotdawgFileText);

// Load tile Mesh
const squareMeshFile = await fetch('Assets/Square.obj');
const squareFileText = await squareMeshFile.text();
const squareMesh = createMeshFromOBJ(gl, squareFileText);

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

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vertexShaderSource, fragmentShaderSource);

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVertexColor and also
  // look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram,"uProjectionMatrix"),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
      uSampler: gl.getUniformLocation(shaderProgram, "uSampler")
    },
  };

  let gameObjects = [];

  let cube = new GameObject();
  cube.mesh = cubeMesh;
  cube.material = new Material(gl, cubeTextureUrl);
  cube.transform.position.x = 10;
  cube.transform.position.y = 6;
  cube.transform.position.z = -40;
  gameObjects.push(cube);


  let hotdawg = new GameObject();
  hotdawg.mesh = hotdawgMesh;
  hotdawg.material = new Material(gl, hotdawgTextureUrl);
  hotdawg.transform.position.x = -10;
  hotdawg.transform.position.y = 5;
  hotdawg.transform.position.z = -30;
  gameObjects.push(hotdawg);

  let sphere = new GameObject();
  sphere.mesh = sphereMesh;
  sphere.material = new Material(gl, hotdawgTextureUrl);
  sphere.transform.position.x = -4;
  sphere.transform.position.y = -2;
  sphere.transform.position.z = -15;
  //gameObjects.push(sphere);

  let square = new GameObject();
  square.mesh = squareMesh;
  square.material = new Material(gl, cubeTextureUrl);
  square.transform.position.x = -1;
  square.transform.position.y = -2;
  square.transform.position.z = -15;
  //gameObjects.push(square);

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

    camera.transform.position.z -= 0.1;

    for(let i=0; i<gameObjects.length; i++){
      //gameObjects[i].transform.rotation.x += 1;
      gameObjects[i].transform.rotation.y += 1;
      //gameObjects[i].transform.rotation.z += 1;
    }

    drawScene(gl, programInfo, gameObjects, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vertexShaderSource, fragmentShaderSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        shaderProgram
      )}`
    );
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}