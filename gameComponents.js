// Created by Winston Palace

class GameObject {
    constructor(){
        this.mesh;
        this.material;
        this.position = new Vector3();
        this.rotation = new Vector3();
        this.scale = new Vector3();
        this.scale.x = 1.0;
        this.scale.y = 1.0;
        this.scale.z = 1.0;
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

// MESH

class Mesh {
    constructor(gl, vertices, triangles){
        this.vertexLength = vertices.length;
        this.triangleLength = triangles.length;
        this.buffers = initBuffers(gl, vertices, triangles);
    }

    getTriangles(gl){
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.triangles);
        const arrBuffer = new ArrayBuffer(this.triangleLength * Uint16Array.BYTES_PER_ELEMENT);
        gl.getBufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(arrBuffer));
    }
}

function initBuffers(gl, vertices, triangles) {
    // Based off of https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API
    const vertexBuffer = initvertexBuffer(gl, vertices);
    const triangleBuffer = initTriangleBuffer(gl, triangles);
    return {position: vertexBuffer, triangles: triangleBuffer,};
}
  
function initvertexBuffer(gl, vertices) {
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    return vertexBuffer;
}
  
function initTriangleBuffer(gl, triangles) {
    const triangleBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangles), gl.STATIC_DRAW); 
    return triangleBuffer;
}

// MATERIAL

class Material {
    constructor(gl, colors){
        this.color = initColorBuffer(gl, colors);
    }
}

function initColorBuffer(gl, colors) {
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    return colorBuffer;
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

// Moves the position of a 4x4 matrix
function transformMat4(mat4, vec3){
    // Based off https://github.com/toji/gl-matrix/blob/master/src/mat4.js
    mat4[12] = mat4[0] * vec3.x + mat4[4] * vec3.y + mat4[8] * vec3.z + mat4[12];
    mat4[13] = mat4[1] * vec3.x + mat4[5] * vec3.y + mat4[9] * vec3.z + mat4[13];
    mat4[14] = mat4[2] * vec3.x + mat4[6] * vec3.y + mat4[10] * vec3.z + mat4[14];
    mat4[15] = mat4[3] * vec3.x + mat4[7] * vec3.y + mat4[11] * vec3.z + mat4[15];
    return mat4;
}

// Changes the rotation of a 4x4 matrix
function rotateMat4(mat4, vec3){
    // Based off https://github.com/toji/gl-matrix/blob/master/src/mat4.js
    let xRad = vec3.x * (Math.PI/180);
    let yRad = vec3.y * (Math.PI/180);
    let zRad = vec3.z * (Math.PI/180);

    let xs = Math.sin(xRad);
    let xc = Math.cos(xRad);

    let ys = Math.sin(yRad);
    let yc = Math.cos(yRad);

    let zs = Math.sin(zRad);
    let zc = Math.cos(zRad);

    var copy = mat4.slice(0);

    mat4[4] = copy[4] * xc + copy[8] * xs;
    mat4[5] = copy[5] * xc + copy[9] * xs;
    mat4[6] = copy[6] * xc + copy[10] * xs;
    mat4[7] = copy[7] * xc + copy[11] * xs;
    mat4[8] = copy[8] * xc - copy[4] * xs;
    mat4[9] = copy[9] * xc - copy[5] * xs;
    mat4[10] = copy[10] * xc - copy[6] * xs;
    mat4[11] = copy[11] * xc - copy[7] * xs;

    copy = mat4.slice(0);

    mat4[0] = copy[0] * yc - copy[8] * ys;
    mat4[1] = copy[1] * yc - copy[9] * ys;
    mat4[2] = copy[2] * yc - copy[10] * ys;
    mat4[3] = copy[3] * yc - copy[11] * ys;
    mat4[8] = copy[0] * ys + copy[8] * yc;
    mat4[9] = copy[1] * ys + copy[9] * yc;
    mat4[10] = copy[2] * ys + copy[10] * yc;
    mat4[11] = copy[3] * ys + copy[11] * yc;

    copy = mat4.slice(0);

    mat4[0] = copy[0] * zc + copy[4] * zs;
    mat4[1] = copy[1] * zc + copy[5] * zs;
    mat4[2] = copy[2] * zc + copy[6] * zs;
    mat4[3] = copy[3] * zc + copy[7] * zs;
    mat4[4] = copy[4] * zc - copy[0] * zs;
    mat4[5] = copy[5] * zc - copy[1] * zs;
    mat4[6] = copy[6] * zc - copy[2] * zs;
    mat4[7] = copy[7] * zc - copy[3] * zs;
    return mat4;
}

// Scales a 4x4 matrix
function scaleMat4(mat4, vec3){
    // Based off https://github.com/toji/gl-matrix/blob/master/src/mat4.js
    mat4[0] = mat4[0] * vec3.x;
    mat4[1] = mat4[1] * vec3.x;
    mat4[2] = mat4[2] * vec3.x;
    mat4[3] = mat4[3] * vec3.x;
    mat4[4] = mat4[4] * vec3.y;
    mat4[5] = mat4[5] * vec3.y;
    mat4[6] = mat4[6] * vec3.y;
    mat4[7] = mat4[7] * vec3.y;
    mat4[8] = mat4[8] * vec3.z;
    mat4[9] = mat4[9] * vec3.z;
    mat4[10] = mat4[10] * vec3.z;
    mat4[11] = mat4[11] * vec3.z;
    return mat4;
}

