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


export {createMat4, createPerspectiveMatrix, transformMat4Position};