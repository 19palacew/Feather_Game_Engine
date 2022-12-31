export { createMeshFromMIE };

function createMeshFromMIE(gl, meshFileText) {
    const mie = JSON.parse(meshFileText);
    console.log(mie.vertices);
    let vertices = mie.vertices;
    let texture = mie.textureCoordinates;
    let triangles = mie.triangles;

    console.log("Vertices: " + vertices);
    console.log("Texture: " + texture);
    console.log("Triangles: " + triangles);

    let mesh = new Mesh(gl, vertices, texture, triangles);
    return mesh;
}