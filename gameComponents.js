// Created by Winston Palace

class Shader {

    static unlitVertexGLSL = 'attribute vec4 aVertexPosition;attribute vec2 aTextureCoord;uniform mat4 uModelViewMatrix;uniform mat4 uProjectionMatrix;varying highp vec2 vTextureCoord;void main(void) {gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;vTextureCoord  = aTextureCoord;}';
    static unlitFragmentGLSL = 'varying highp vec2 vTextureCoord;uniform sampler2D uSampler;void main(void) {gl_FragColor = texture2D(uSampler, vTextureCoord);}';

    static dummyVertexGLSL = 'attribute vec4 aVertexPosition;attribute vec2 aTextureCoord;uniform mat4 uProjectionMatrix;varying highp vec2 vTextureCoord;void main(void) {gl_Position = uProjectionMatrix * aVertexPosition;vTextureCoord  = aTextureCoord;}';
    static dummyFragmentGLSL = 'varying highp vec2 vTextureCoord;uniform sampler2D uSampler;void main(void) {gl_FragColor = texture2D(uSampler, vTextureCoord);}';

    constructor(gl, vertexShaderSource, fragmentShaderSource, shaderType = 0) {

        // Initialize a shader program; this is where all the lighting
        // for the vertices and so forth is established.
        const shaderProgram = this.initShaderProgram(gl, vertexShaderSource, fragmentShaderSource);

        // Collect all the info needed to use the shader program.
        // Look up which attributes our shader program is using
        // for aVertexPosition, aVertexColor and also
        // look up uniform locations.
        this.programInfo = null;
        switch(shaderType){
            case 0:
                this.programInfo = {
                    program: shaderProgram,
                    attribLocations: {
                        vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
                        textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
                    },
                    uniformLocations: {
                        projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
                        modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
                        uSampler: gl.getUniformLocation(shaderProgram, "uSampler")
                    },
                };
                break;
            case 1:
                this.programInfo = {
                    program: shaderProgram,
                    attribLocations: {
                        vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
                        textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
                    },
                    uniformLocations: {
                        projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
                        uSampler: gl.getUniformLocation(shaderProgram, "uSampler")
                    },
                };
        }
    }

    //
    // Initialize a shader program, so WebGL knows how to draw our data
    //
    initShaderProgram(gl, vertexShaderSource, fragmentShaderSource) {
        const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

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

    // Creates a shader of the given type, uploads the source and compiles it.
    loadShader(gl, type, source) {
        const shader = gl.createShader(type);

        // Send the source to the shader object

        gl.shaderSource(shader, source);

        // Compile the shader program

        gl.compileShader(shader);

        // See if it compiled successfully

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }
}

class ShaderList{
    constructor(gl){
        this.UNLIT = new Shader(gl, Shader.unlitVertexGLSL, Shader.unlitFragmentGLSL, 0);
        this.DUMMY = new Shader(gl, Shader.dummyVertexGLSL, Shader.dummyFragmentGLSL, 0);
    }
}

class GameObject {
    constructor(){
        this.transform = new Transform();
        this.mesh;
        this.material;
        this.shader = Shader.UNLIT;
    }
}

class Transform {
    constructor(){
        this.position = new Vector3();
        this.rotation = new Vector3();
        this.scale = new Vector3();
        this.scale.x = 1.0;
        this.scale.y = 1.0;
        this.scale.z = 1.0;
    }

    toMat4(){
        let modelViewMatrix = createMat4();
        modelViewMatrix = transformMat4(modelViewMatrix, this.position);
        modelViewMatrix = rotateMat4(modelViewMatrix, this.rotation);
        modelViewMatrix = scaleMat4(modelViewMatrix, this.scale);
        return modelViewMatrix;
    }
}

class Camera{
    #projectionMatrix;
    constructor(fieldOfView = (45 * Math.PI) / 180, aspect = 1 + 1/3, zNear = 0.1, zFar = 100.0){
        // Create a perspective matrix, a special matrix that is
        // used to simulate the distortion of perspective in a camera.
        // Default field of view is 45 degrees and we only want to see
        // objects between zNear units and zFar units away from the camera.
  
        this.#projectionMatrix = createPerspectiveMatrix(fieldOfView, aspect, zNear, zFar);
        this.transform = new Transform();
    }

    get projectionMatrix(){
        let temp = copyMat4(this.#projectionMatrix);
        temp = transformMat4(temp, this.transform.position);
        temp = rotateMat4(temp, this.transform.rotation);
        temp = scaleMat4(temp, this.transform.scale);
        return temp;
    }

}

// Primitives

class Vector3 {
    constructor(x = 0, y = 0, z = 0){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(second){
        this.x += second.x;
        this.y += second.y;
        this.z += second.z;
    }

    multiply(scalar){
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
    }

    static add(first, second){
        let copy = this.clone(first);
        copy.add(second);
        return copy;
    }

    static clone(original){
        let copy = new Vector3(original.x, original.y, original.z);
        return copy;
    }
}

// MESH

class Mesh {
    constructor(gl, vertices, textureCoord, triangles){
        this.vertexLength = vertices.length;
        this.triangleLength = triangles.length;
        this.buffers = this.initBuffers(gl, vertices, textureCoord, triangles);
    }

    initBuffers(gl, vertices, textureCoord, triangles) {
        // Based off of https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API
        const vertexBuffer = this.initvertexBuffer(gl, vertices);
        const textureCoordBuffer = this.initTextureCoordinatesBuffer(gl, textureCoord);
        const triangleBuffer = this.initTriangleBuffer(gl, triangles);
        return {position: vertexBuffer, textureCoordinates: textureCoordBuffer, triangles: triangleBuffer};
    }
      
    initvertexBuffer(gl, vertices) {
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return vertexBuffer;
    }
    
    initTextureCoordinatesBuffer(gl, textureCoordinates) {
        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW); 
        return textureCoordBuffer;
    }
      
    initTriangleBuffer(gl, triangles) {
        const triangleBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangles), gl.STATIC_DRAW); 
        return triangleBuffer;
    }
}

// MATERIAL

class Material {
    constructor(gl, texture){
        this.texture = initTexture(gl, texture);
    }
}

function initTexture(gl, image) {
    const texture = gl.createTexture();

    const level = 0;
    const internalFormat = gl.RGBA;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
    }
    else {
        // No, it's not a power of 2. Turn off mips and set
        // wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    return texture;
}

function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
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

function copyMat4(mat4){
    let copy = createMat4();
    copy[0] = mat4[0];
    copy[1] = mat4[1];
    copy[2] = mat4[2];
    copy[3] = mat4[3];
    copy[4] = mat4[4];
    copy[5] = mat4[5];
    copy[6] = mat4[6];
    copy[7] = mat4[7];
    copy[8] = mat4[8];
    copy[9] = mat4[9];
    copy[10] = mat4[10];
    copy[11] = mat4[11];
    copy[12] = mat4[12];
    copy[13] = mat4[13];
    copy[14] = mat4[14];
    copy[15] = mat4[15];
    return copy;
}