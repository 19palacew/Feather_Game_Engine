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
const cubeMeshFile = await fetch('Assets/Cube.mie');
const cubeFileText = await cubeMeshFile.text();
const cubeMesh = createMeshFromMIE(gl, cubeFileText);


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

/*
  const vertices = [
    -1.0,-1.0,-1.0,
    1.0,-1.0,-1.0,
    1.0, 1.0,-1.0,
    -1.0, 1.0,-1.0,
    -1.0,-1.0, 1.0,
    1.0,-1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0
  ];

  var colors = [
    0.0, 0.0, 0.0, 1.0, // black
    1.0, 0.0, 0.0, 1.0, // red
    1.0, 1.0, 0.0, 1.0, // yellow
    0.0, 1.0, 0.0, 1.0, // green
    0.0, 0.0, 1.0, 1.0, // blue
    1.0, 0.0, 1.0, 1.0, // magenta
    1.0, 1.0, 1.0, 1.0, // white
    0.0, 1.0, 1.0, 1.0  // cyan
  ];

  const triangles = [
    0,2,1, 0,3,2,  // Z-
    0,1,5, 0,5,4,  // Y-
    1,2,6, 1,6,5,  // X+
    2,7,6, 2,3,7,  // Y+
    3,4,7, 3,0,4,  // X-
    4,5,6, 4,6,7   // Z+
  ];
  */

  var colors = [
    0.0, 0.0, 0.0, 1.0, // black
    1.0, 0.0, 0.0, 1.0, // red
    1.0, 1.0, 0.0, 1.0, // yellow
    0.0, 1.0, 0.0, 1.0, // green
    0.0, 0.0, 1.0, 1.0, // blue
    1.0, 0.0, 1.0, 1.0, // magenta
    1.0, 1.0, 1.0, 1.0, // white
    0.0, 1.0, 1.0, 1.0  // cyan
  ];

  let gameObjects = [];

  let cube = new GameObject();
  cube.mesh = cubeMesh;
  cube.material = new Material(gl, cubeTextureUrl);
  cube.position.x = 2;
  cube.position.y = -2;
  cube.position.z = -15;
  gameObjects.push(cube);


  let hotdawg = new GameObject();
  hotdawg.mesh = hotdawgMesh;
  hotdawg.material = new Material(gl, hotdawgTextureUrl);
  hotdawg.position.x = -10;
  hotdawg.position.y = 5;
  hotdawg.position.z = -30;
  gameObjects.push(hotdawg);

  let sphere = new GameObject();
  sphere.mesh = sphereMesh;
  sphere.material = new Material(gl, hotdawgTextureUrl);
  sphere.position.x = -4;
  sphere.position.y = -2;
  sphere.position.z = -15;
  //gameObjects.push(sphere);

  let square = new GameObject();
  square.mesh = squareMesh;
  square.material = new Material(gl, cubeTextureUrl);
  square.position.x = -1;
  square.position.y = -2;
  square.position.z = -15;
  //gameObjects.push(square);

  let then = 0;

  // Draw the scene repeatedly
  function render(now) {

    //console.log(gl.getError());

    now *= 0.001; // convert to seconds
    deltaTime = now - then;
    then = now;

    for(let i=0; i<gameObjects.length; i++){
      //gameObjects[i].rotation.x += 1;
      gameObjects[i].rotation.y += 1;
      //gameObjects[i].rotation.z += 1;
    }

    drawScene(gl, programInfo, gameObjects);

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