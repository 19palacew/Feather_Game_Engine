attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec4 worldPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying lowp vec4 vColor;

void main(void) {
    float x = -0.0;
    float y = 0.0;
    float z = -6.0;
    mat4 a = mat4(1.0, 0.0, 0.0, x, 0.0, 1.0, 0.0, y, 0.0, 0.0, 1.0, z, 0.0, 0.0, 0.0, 1.0);

    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition * a;
    vColor = aVertexColor;
}