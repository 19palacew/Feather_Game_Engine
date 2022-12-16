import {createMat4, createPerspectiveMatrix, transformMat4Position} from "./mat4.js";

function drawScene(gl, programInfo, gameObjects) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
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
  
    gameObjects[0].position.x = -10;
    gameObjects[0].position.y = 10;
    gameObjects[0].position.z = -30;

    gameObjects[1].position.x = 2;
    gameObjects[1].position.y = -2;
    gameObjects[1].position.z = -15;
    
    for (let i=0;i<gameObjects.length; i++) {

      var modelViewMatrix = createMat4();
      console.log(modelViewMatrix);
      modelViewMatrix = transformMat4Position(modelViewMatrix, gameObjects[i].position);
      console.log(modelViewMatrix);

      // Tell WebGL how to pull out the positions from the position
      // buffer into the vertexPosition attribute.
      setPositionAttribute(gl, gameObjects[i].mesh.buffers, programInfo);
      setColorAttribute(gl, gameObjects[i].mesh.buffers, programInfo);

      // Tell WebGL which indices to use to index the vertices
    //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  
    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);
  
    // Set the shader uniforms
    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false,modelViewMatrix);
  
    {
      
      const vertexCount = 36;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
    }
  }
  
  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  function setPositionAttribute(gl, buffers, programInfo) {
    const numComponents = 3;
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }
  
  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  function setColorAttribute(gl, buffers, programInfo) {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexColor,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
  }
  
  export { drawScene };