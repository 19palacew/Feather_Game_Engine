class GameObject {
    constructor(gl, mesh){
        this.mesh = mesh;
        this.position = new Vector3();
        this.rotation = new Eular();
    }
}

class Mesh {
    constructor(gl, vertices, colors, triangles){
        this.buffers = initBuffers(gl, vertices, colors, triangles);
    }
}

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