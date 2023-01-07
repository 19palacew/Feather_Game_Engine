// Winston Palace
// Based off of https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API

function drawScene(gl, gameObjects, camera) {
    gl.clearColor(0.0, 0.5, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    //gl.enable(gl.CULL_FACE); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  
    // Clear the canvas before we start drawing on it.
  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    const projectionMatrix = camera.projectionMatrix;
    
    for (let i=0;i<gameObjects.length; i++) {

      const programInfo = gameObjects[i].shader.programInfo;

      let modelViewMatrix = gameObjects[i].transform.toMat4();

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
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, type, normalize, stride, offset);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoordinates);
    gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, 2, type, normalize, stride, offset);
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
  }