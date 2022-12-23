export { createMeshFromOBJ };

function createMeshFromOBJ(gl, meshFileText) {
    const lines = meshFileText.split('\n');

    let vertices = [];
    let texture  = [];
    let triangles = [];

  // Meshes need to be triangulated

    for (var i=0; i<lines.length; i++){
        const temp = lines[i].split(' ');
        if (temp[0] == 'v'){
            vertices.push(parseFloat(temp[1]));
            vertices.push(parseFloat(temp[2]));
            vertices.push(parseFloat(temp[3]));
        }
        if (temp[0] == 'vt'){
          texture.push(parseFloat(temp[1]));
          texture.push(parseFloat(temp[2]));
        }
        if (temp[0] == 'f'){
          // f 2/1/1 3/2/1 1/3/1
          // is equivalent to
          // f v/vt/vn v/vt/vn v/vt/vn
          // with v being vertex, vt vertex texture, vn vertex normal, also 1 base indexed
          for (let x=1; x<temp.length; x++){
            const faceData = temp[x].split('/');
            triangles.push(faceData[0]-1);
            //console.log(parseInt(faceData[0])-1);
            //console.log(faceData[0]-1);
          }
        }
    }
    //console.log(texture);
    let mesh = new Mesh(gl, vertices, texture, triangles);
    return mesh;
}