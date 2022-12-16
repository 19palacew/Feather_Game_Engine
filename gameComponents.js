class GameObject {
    constructor(gl, mesh){
        this.mesh = mesh;
        this.position = new Vector3();
        this.rotation = new Eular();
    }
}

// Primitives

class Vector3 {
    constructor(){
        this.x = 0.0;
        this.y = 0.0;
        this.z = 0.0;
    }
}

class Eular {
    constructor(){
        this.x = 0.0;
        this.y = 0.0;
        this.z = 0.0;
    }
}

class Quaternion {
    constructor(){
        this.x = 0.0;
        this.y = 0.0;
        this.z = 0.0;
        this.w = 0.0;
    }
}

// MESH

class Mesh {
    constructor(gl, vertices, colors, triangles){
        this.buffers = initBuffers(gl, vertices, colors, triangles);
    }
}

function initBuffers(gl, vertices, colors, triangles) {
    const vertexBuffer = initvertexBuffer(gl, vertices);
  
    const colorBuffer = initColorBuffer(gl, colors);
  
    const triangleBuffer = initTriangleBuffer(gl, triangles);
  
    return {
      position: vertexBuffer,
      color: colorBuffer,
      triangles: triangleBuffer,
    };
}
  
function initvertexBuffer(gl, vertices) {
    // Create a buffer for the square's vertices.
    const vertexBuffer = gl.createBuffer();
  
    // Select the vertexBuffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  
    // Now pass the list of vertices into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
    return vertexBuffer;
}
  
function initColorBuffer(gl, colors) {
  
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  
    return colorBuffer;
}
  
function initTriangleBuffer(gl, triangles) {
    const triangleBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer);
  
    // Now send the element array to GL
  
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangles), gl.STATIC_DRAW);
  
    return triangleBuffer;
}

// MATRIX

function createMat4(){
    const mat4 = new Float32Array(16);
    mat4[0] = 1;
    mat4[5] = 1;
    mat4[10] = 1;
    mat4[15] = 1;
    return mat4;
}

function createPerspectiveMatrix(fieldOfView, aspect, zNear, zFar) {
    const perpMatrix = new Float32Array(16);
    const f = 1.0/Math.tan(fieldOfView/2)
    const rangeInv = 1/(zNear-zFar);
    perpMatrix[0] = f/aspect;
    perpMatrix[5] = f;
    perpMatrix[10] = (zFar+zNear) * rangeInv;
    perpMatrix[11] = -1;
    perpMatrix[14] = zNear * zFar * rangeInv * 2;
    return perpMatrix;
}

function transformMat4Position(mat4, vec3){
    mat4[12] = mat4[0] * vec3.x + mat4[4] * vec3.y + mat4[8] * vec3.z + mat4[12];
    mat4[13] = mat4[1] * vec3.x + mat4[5] * vec3.y + mat4[9] * vec3.z + mat4[13];
    mat4[14] = mat4[2] * vec3.x + mat4[6] * vec3.y + mat4[10] * vec3.z + mat4[14];
    mat4[15] = mat4[3] * vec3.x + mat4[7] * vec3.y + mat4[11] * vec3.z + mat4[15];
    return mat4;
}