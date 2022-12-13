function initBuffers(gl) {
    const vertexBuffer = initvertexBuffer(gl);
  
    const colorBuffer = initColorBuffer(gl);
  
    const triangleBuffer = initTriangleBuffer(gl);
  
    return {
      position: vertexBuffer,
      color: colorBuffer,
      triangles: triangleBuffer,
    };
  }
  
  function initvertexBuffer(gl) {
    // Create a buffer for the square's vertices.
    const vertexBuffer = gl.createBuffer();
  
    // Select the vertexBuffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  
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
  
    // Now pass the list of vertices into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
    return vertexBuffer;
  }
  
  function initColorBuffer(gl) {
    const faceColors = [
      [1.0, 1.0, 1.0, 1.0], // Front face: white
      [1.0, 0.0, 0.0, 1.0], // Back face: red
      [0.0, 1.0, 0.0, 1.0], // Top face: green
      [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
      [1.0, 1.0, 0.0, 1.0], // Right face: yellow
      [1.0, 0.0, 1.0, 1.0], // Left face: purple
    ];
  
    // Convert the array of colors into a table for all the vertices.
  
    var colors = [];
  
    for (var j = 0; j < faceColors.length; ++j) {
      const c = faceColors[j];
      // Repeat each color four times for the four vertices of the face
      colors = colors.concat(c, c, c, c);
    }
  
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  
    return colorBuffer;
  }
  
  function initTriangleBuffer(gl) {
    const triangleBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer);
  
    const triangles = [
      0,2,1, 0,3,2,  // Z-
      0,1,5, 0,5,4,  // Y-
      1,2,6, 1,6,5,  // X+
      2,7,6, 2,3,7,  // Y+
      3,4,7, 3,0,4,  // X-
      4,5,6, 4,6,7   // Z+
    ];
  
    // Now send the element array to GL
  
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangles), gl.STATIC_DRAW);
  
    return triangleBuffer;
  }
  
  export { initBuffers };  