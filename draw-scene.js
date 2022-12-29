// Winston Palace
// Based off of https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API

export { drawScene };

function drawScene(gl, programInfo, gameObjects) {
    gl.clearColor(1, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  
    // Clear the canvas before we start drawing on it.
  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.
  
    const fieldOfView = (45 * Math.PI) / 180; // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
  
    const projectionMatrix = createPerspectiveMatrix(fieldOfView, aspect, zNear, zFar);
    
    for (let i=0;i<gameObjects.length; i++) {

      let modelViewMatrix = createMat4();
      modelViewMatrix = transformMat4(modelViewMatrix, gameObjects[i].position);
      modelViewMatrix = rotateMat4(modelViewMatrix, gameObjects[i].rotation);
      modelViewMatrix = scaleMat4(modelViewMatrix, gameObjects[i].scale);

      // Tell WebGL how to pull out the positions from the position
      // buffer into the vertexPosition attribute.
      setVertexAttributes(gl, gameObjects[i].mesh.buffers, programInfo);

      // Tell WebGL which indices to use to index the vertices
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gameObjects[i].mesh.buffers.triangles);

      // Tell WebGL to use our program when drawing
      gl.useProgram(programInfo.program);
  
      // Set the shader uniforms
      gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
      gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

      // Tell WebGL we want to affect texture unit 0
      gl.activeTexture(gl.TEXTURE0);

      // Bind the texture to texture unit 0
      gl.bindTexture(gl.TEXTURE_2D, gameObjects[i].material.texture);

      // Tell the shader we bound the texture to texture unit 0
      gl.uniform1i(programInfo.uniformLocations.uTexture, 0);
  
      {
        const vertexCount = gameObjects[i].mesh.triangleLength;
        //console.log(vertexCount);
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
      }
    }
  }
  

  function setVertexAttributes(gl, buffers, programInfo) {
    const numComponents = 3;
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoordinates);
    gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, 2, type, normalize, stride, offset);
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
  }