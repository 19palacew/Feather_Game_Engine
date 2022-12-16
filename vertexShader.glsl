attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec4 worldPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying lowp vec4 vColor;

void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition + worldPosition;
    vColor = aVertexColor;
}