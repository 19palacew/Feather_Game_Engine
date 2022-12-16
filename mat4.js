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

export {createMat4, createPerspectiveMatrix};