export const kSimpleVS = `
attribute vec3 aVertexPosition;
uniform mat4 uModelXformMatrix;

void main(void) {
   gl_Position = uModelXformMatrix * vec4(aVertexPosition, 1.0);
}
`;
