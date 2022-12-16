import { drawScene} from "./draw-scene.js";

let cubeRotation = 0.0;
let deltaTime = 0;

// Vertex shader program
const vertexShaderFile = await fetch('vertexShader.glsl');
const vertexShaderSource = await vertexShaderFile.text();

// Fragment shader program
const fragmentShaderFile = await fetch('fragmentShader.glsl');
const fragmentShaderSource = await fragmentShaderFile.text();

main();

//
// start here
//
function main() {
  const canvas = document.querySelector("#canvas");
  // Initialize the GL context
  const gl = canvas.getContext("webgl");

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
      vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        "uProjectionMatrix"
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
    },
  };


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
  let cubeMesh = new Mesh(gl, vertices, colors, triangles);
  let cube = new GameObject(gl, cubeMesh);

  const vertices2 = [
    -1.0,-1.0,-1.0,
    1.0,-1.0,-1.0,
    1.0, 1.0,-1.0,
    -1.0, 1.0,-1.0,
    -1.0,-1.0, 1.0,
    1.0,-1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0
  ];

  var colors2 = [
    1.0, 0.0, 0.0, 1.0, // red
    1.0, 0.0, 0.0, 1.0, // red
    1.0, 0.0, 0.0, 1.0, // red
    1.0, 0.0, 0.0, 1.0, // red
    1.0, 0.0, 0.0, 1.0, // red
    1.0, 0.0, 0.0, 1.0, // red
    1.0, 0.0, 0.0, 1.0, // red
    1.0, 0.0, 0.0, 1.0, // red
  ];

  let cubeMesh2 = new Mesh(gl, vertices2, colors2, triangles);
  let cube2 = new GameObject(gl, cubeMesh2);

  let gameObjects = [cube];

  let then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001; // convert to seconds
    deltaTime = now - then;
    then = now;

    drawScene(gl, programInfo, gameObjects);
    cubeRotation += deltaTime;

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